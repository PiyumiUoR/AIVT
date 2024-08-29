require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/database');

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Function to find a user by email
async function findUserByEmail(email) {
    const result = await pool.query('SELECT * FROM Reporter WHERE email = $1', [email]);
    return result.rows[0];
}

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Reporter');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// A function to find user by ID 
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT reporterId AS id, name, email, organization FROM Reporter WHERE reporterId = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const reportData = {
            id: user.id,
            name: user.name,
            email: user.email,
            organization: user.organization
        };
        res.json(reportData);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// A function to create a new user
exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, organization } = req.body;

    try {
        let user = await findUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt();
        // console.log('Salt:', salt);  
        
        const hashedPassword = await bcrypt.hash(password, salt);
        // console.log('Hashed Password:', hashedPassword);

        // Corrected SQL query and arguments
        const result = await pool.query(
            'INSERT INTO Reporter (name, email, organization, password, salt) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, organization, hashedPassword, salt]
        );
        user = result.rows[0];

        // Log the user object to ensure reporterid exists
        // console.log('User object:', user);

        if (!user || !user.reporterid) {
            return res.status(500).json({ message: 'Failed to create user or missing reporterid' });
        }

        const token = jwt.sign({ id: user.reporterid }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// A function to find a user by email and login
exports.findUserByEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        // Log the user object to ensure reporterid exists
        // console.log('User object:', user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        if (!user.reporterid) {
            return res.status(500).json({ message: 'User ID not found' });
        }

        const token = jwt.sign({ id: user.reporterid }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Helper function to fetch user by ID
exports.fetchUserById = async (id) => {
    try {
        const result = await pool.query(
            'SELECT reporterId AS id, name, email, organization, role FROM Reporter WHERE reporterId = $1',
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0];
    } catch (err) {
        console.error('Error fetching user by ID:', err.message);
        throw new Error('Internal server error');
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await this.fetchUserById(userId);  

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const result = await pool.query('UPDATE Reporter SET role = $1 WHERE reporterId = $2 RETURNING *', [role, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
