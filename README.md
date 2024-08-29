# AIVT - AI Vulnerability Taxonomy system

Welcome to AIVT, the AI Vulnerability Taxonomy Database. We are dedicated to identifying, analyzing, and mitigating vulnerabilities in AI systems to ensure their safety, security, and reliability. Our mission is to provide a comprehensive and accessible platform for reporting and sharing information about AI vulnerabilities, fostering a collaborative community among AI developers, researchers, and users.

## Deploying the system in local machine 

### Prerequisites

Before running the system in local machine, ensure that below prerequisites are met. 

* Node.js and npm
* PostgreSQL

### Deploying the database

1. Install PostgreSQL. ([PostgreSQL's official website](https://www.postgresql.org/download/))
2. Open a terminal or command prompt and connect to PostgreSQL using the `psql` command. Replace `username` with your PostgreSQL username. Bydefault it's `postgres`.
   ```sh
   psql -U postgres
   ```
3. Execute the following SQL commands to create a new database.
    ```sql
    CREATE DATABASE aivtdb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

    -- Connect to the newly created database
    \c aivtdb
    ```
4. Execute the following SQL commands to create the required ENUM types and tables. 

    ```sql
    -- Create ENUM types
    CREATE TYPE phase_enum AS ENUM ('Development', 'Training', 'Deployment and Use');
    CREATE TYPE attribute_enum AS ENUM ('Accuracy', 'Fairness', 'Privacy', 'Reliability', 'Resiliency', 'Robustness', 'Safety');
    CREATE TYPE effect_enum AS ENUM ('0: Correct functioning', '1: Reduced functioning', '2: No actions', '3: Chaotic', '4: Directed actions', '5: Random actions OoB', '6: Directed actions OoB');

    -- Create table Reporter
    CREATE TABLE Reporter (
        reporterId SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        organization VARCHAR(255)
    );

    -- Create table Vul_report
    CREATE TABLE Vul_report (
        reportId SERIAL PRIMARY KEY,
        title VARCHAR(255),
        report_description VARCHAR(510),
        reporterId INTEGER, 
        FOREIGN KEY (reporterId) REFERENCES Reporter(reporterId)
    );

    -- Create table Artifact
    CREATE TABLE Artifact (
        artifactId SERIAL PRIMARY KEY,
        artifactName VARCHAR(255),
        artifactType VARCHAR(255),
        developer VARCHAR(255),
        deployer VARCHAR(255),
        reportId INTEGER,
        FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
    );

    -- Create table Vul_phase
    CREATE TABLE Vul_phase (
        phId SERIAL PRIMARY KEY,
        phase phase_enum,
        phase_description VARCHAR(510),
        reportId INTEGER,
        FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
    );

    -- Create table Attribute_type
    CREATE TABLE Attribute (
        attributeTypeId SERIAL PRIMARY KEY,
        attr_description VARCHAR(510),
        phId INTEGER,
        FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
    );

    -- Create table Attribute_names
    CREATE TABLE Attribute_names (
        attributeId SERIAL PRIMARY KEY,
        attributeName attribute_enum
    );

    --Create table All_attributes for the multiple selection with many-to-many connection
    CREATE TABLE All_attributes (
        attributeTypeId INTEGER,
        attributeId INTEGER,
        FOREIGN KEY (attributeTypeId) REFERENCES Attribute(attributeTypeId),
        FOREIGN KEY (attributeId) REFERENCES Attribute_names(attributeId),
        PRIMARY KEY (attributeTypeId, attributeId)
    );

    -- Create the modified Effect table
    CREATE TABLE Effect (
        effectTypeId SERIAL PRIMARY KEY,
        effectName effect_enum,
        eff_description VARCHAR(510),
        phId INTEGER,
        FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
    );

    -- Create table Attachments
    CREATE TABLE Attachments (
        infoId SERIAL,
        artifactId INTEGER,
        attachments BYTEA,
        filename VARCHAR(255),
        mimeType VARCHAR(255),
        FOREIGN KEY (artifactId) REFERENCES Artifact(artifactId)
    );
    ```

### Create the secret token

1. Type `node` in the terminal. 
2. Generate the token using 

```cli
require('crypto').randomBytes(64).toString('hex')
```

3. Create a new file called `.env` in the **backend** directory. and create a new environment `JWT_SECRET`. 

4. Assign the generated key by copy and paste to the `JWY_SECRET`. At the end, the `.env` file looks like below. 

```txt
JWT_SECRET=the_generated_key
```

### Running the backend

Go to the `/backend` directory and `npm run dev`.

### Running the frontend

Go to the `/frontend` directory and run `npm start`. The system can be accessed through `http://localhost:3000/`.

## Deploying the system in CSC VM

Here's an enhanced version of your `README.md` file, which provides a detailed description of the entire process, including setting up the VM, installing necessary packages, configuring the backend and frontend, and managing the services using PM2 and Nginx.

### Prerequisites

Before deploying the AIVT system, ensure that your environment meets the following prerequisites:

- Ubuntu 20.04 or later
- Node.js and npm
- PostgreSQL
- Nginx
- PM2

### Setting Up the Environment

#### Step 1: Update and Upgrade Your System

First, update and upgrade your system packages to ensure everything is up to date:

```bash
sudo apt update
sudo apt upgrade
```

#### Step 2: Install Required Packages

Install Node.js, npm, and Nginx:

```bash
sudo apt install nodejs npm nginx
```

Check the installed versions:

```bash
node -v
npm -v
```

#### Step 3: Set Up the Backend

1. **Clone the AIVT Repository:**

   ```bash
   git clone https://github.com/PiyumiUoR/AIVT.git
   cd AIVT/backend/
   ```

2. **Install Backend Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up PM2 to Manage the Backend Process:**

   Install PM2 globally:

   ```bash
   sudo npm install -g pm2
   ```

   Start the backend server using PM2:

   ```bash
   pm2 start server.js --name backend
   ```

   Set up PM2 to run on startup:

   ```bash
   pm2 startup
   pm2 save
   ```

#### Step 4: Set Up the Frontend

1. **Navigate to the Frontend Directory:**

   ```bash
   cd ../frontend/
   ```

2. **Install Frontend Dependencies:**

   ```bash
   npm install
   ```

3. **Build the Frontend:**

   Build the frontend for production:

   ```bash
   npm run build
   ```

#### Step 5: Configure Nginx

1. **Create an Nginx Configuration for the React Frontend:**

   Open the Nginx configuration file:

   ```bash
   sudo nano /etc/nginx/sites-available/react-frontend
   ```

   Add the following configuration to serve the React app:

   ```nginx
   server {
    listen 80;
    server_name 192.16.1.105 86.50.169.201;

    root /home/ubuntu/AIVT/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    client_max_body_size 50M;

    error_log  /var/log/nginx/vue-app-error.log;
    access_log /var/log/nginx/vue-app-access.log;
    error_page 404 /404.html;
   }
   ```

2. **Enable the Nginx Configuration:**

   Create a symbolic link to enable the configuration:

   ```bash
   sudo ln -s /etc/nginx/sites-available/react-frontend /etc/nginx/sites-enabled/
   ```

3. **Test and Restart Nginx:**

   Test the Nginx configuration for syntax errors:

   ```bash
   sudo nginx -t
   ```

   Restart Nginx to apply the changes:

   ```bash
   sudo systemctl restart nginx
   ```

4. **Open Necessary Ports:**

   Allow Nginx Full and any other necessary ports (e.g., for your backend):

   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow 5000/tcp
   ```

#### Step 6: Install and Configure PostgreSQL

1. **Install PostgreSQL:**

   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

2. **Start and Enable PostgreSQL Service:**

   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Create the Database:**

   Connect to PostgreSQL:

   ```bash
   sudo -i -u postgres
   psql
   ```

   Create a new database:

   ```sql
   CREATE DATABASE aivtdb
   WITH
   OWNER = postgres
   ENCODING = 'UTF8'
   LC_COLLATE = 'English_United States.1252'
   LC_CTYPE = 'English_United States.1252'
   LOCALE_PROVIDER = 'libc'
   TABLESPACE = pg_default
   CONNECTION LIMIT = -1
   IS_TEMPLATE = False;
   ```

   Connect to the new database:

   ```sql
   \c aivtdb
   ```

   Create the required ENUM types and tables with the SQL shown in [Deploying the database](#deploying-the-database).

4. **Set Up the Backend to Use the Database:**

   Edit the `.env` file with a secret token value. The steps are shown in [Create the secret token](#create-the-secret-token).

#### Step 7: Monitor and Manage Services

1. **Monitor Nginx Logs:**

   To view Nginx error logs:

   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

#### Step 8: Final Steps

1. **Set Permissions for the Frontend Build Directory:**

   Set the correct permissions:

   ```bash
   sudo chown -R ubuntu:www-data /home/ubuntu/AIVT/frontend/build
   sudo chmod -R 755 /home/ubuntu/AIVT/frontend/build
   ```

2. **Test Everything:**

   - Access the frontend via your IP as `http://your_ip/.
   - Ensure the backend is running properly.
   - Verify that Nginx is correctly proxying requests to the backend.                  
