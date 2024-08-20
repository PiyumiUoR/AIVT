const { fetchReportById } = require('../controllers/reportController');

// Middleware to check if the user is the owner
const checkOwner = async (req, res, next) => {
    try {
        const reportId = req.params.id;
        const vulnerability = await fetchReportById(reportId);
        console.log(vulnerability);

        // Check if the vulnerability report exists
        if (!vulnerability) {
            return res.status(404).json({ message: "Report not found." });
        }
        console.log(req.user);

        // Compare the email of the reporter with the logged-in user
        if (vulnerability.reporterId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: You are not allowed to edit or delete this report." });
        }
        
        next();
    } catch (error) {
        console.error("Error in checkOwner middleware:", error);
        res.status(500).json({ message: "Server error while checking report ownership." });
    }
};

module.exports = checkOwner;
