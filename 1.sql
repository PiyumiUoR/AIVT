-- Database: aivtdb

-- DROP DATABASE IF EXISTS aivtdb;

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

-- Create ENUM types
CREATE TYPE phase_enum AS ENUM ('Development', 'Training', 'Deployment and Use');
CREATE TYPE attribute_enum AS ENUM ('Accuracy', 'Fairness', 'Privacy', 'Reliability', 'Resiliency', 'Robustness', 'Safety');
CREATE TYPE effect_enum AS ENUM ('0: Correct functioning', '1: Reduced functioning', '2: No actions', '3: Random actions', '4: Directed actions', '5: Random actions OoB', '6: Directed actions OoB');

-- Create table Vul_report
CREATE TABLE Vul_report (
    reportId INTEGER PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(510),
    artifactId INTEGER,
    reporterId INTEGER,
    phId INTEGER
);

-- Create table Reporter
CREATE TABLE Reporter (
    reporterId INTEGER PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    organization VARCHAR(255),
    reportId INTEGER,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
);

-- Create table Artifact
CREATE TABLE Artifact (
    artifactId INTEGER PRIMARY KEY,
    artifactName VARCHAR(255),
    artifactType VARCHAR(255),
    developer VARCHAR(255),
    deployer VARCHAR(255),
    reportId INTEGER,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
);

-- Create table Vul_phase
CREATE TABLE Vul_phase (
    phId INTEGER PRIMARY KEY,
    phase phase_enum,
    description VARCHAR(510),
    reportId INTEGER,
    FOREIGN KEY (reportId) REFERENCES Vul_report(reportId)
);

-- Create table Attribute_type
CREATE TABLE Attribute_type (
    attributeTypeId INTEGER PRIMARY KEY,
    attributeName attribute_enum,
    attributeValue BOOLEAN,
    phId INTEGER,
    FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
);

-- Create table Attribute_desc
CREATE TABLE Attribute_desc (
    descId INTEGER PRIMARY KEY,
    attributeTypeId INTEGER,
    description VARCHAR(510),
    FOREIGN KEY (attributeTypeId) REFERENCES Attribute_type(attributeTypeId)
);

-- Create table Effect_type
CREATE TABLE Effect_type (
    effectTypeId INTEGER PRIMARY KEY,
    effectName effect_enum,
    effectValue BOOLEAN,
    phId INTEGER,
    FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
);

-- Create table Effect_desc
CREATE TABLE Effect_desc (
    descId INTEGER PRIMARY KEY,
    effectTypeId INTEGER,
    description VARCHAR(510),
    FOREIGN KEY (effectTypeId) REFERENCES Effect_type(effectTypeId)
);

-- Create table Attachments
CREATE TABLE Attachments (
    infoId INTEGER,
    artifactId INTEGER,
    attachments BYTEA,
    FOREIGN KEY (artifactId) REFERENCES Artifact(artifactId)
);

-- Sample data for Vul_report
INSERT INTO Vul_report (reportId, title, description, artifactId, reporterId, phId)
VALUES 
(1, 'SQL Injection Vulnerability', 'A SQL injection vulnerability in the login form.', 1, 1, 1),
(2, 'Cross-Site Scripting', 'A persistent XSS vulnerability in the comment section.', 2, 2, 2);

-- Sample data for Reporter
INSERT INTO Reporter (reporterId, name, email, organization, reportId)
VALUES 
(1, 'John Doe', 'john.doe@example.com', 'CyberSec Inc.', 1),
(2, 'Jane Smith', 'jane.smith@example.com', 'SecureTech', 2);

-- Sample data for Artifact
INSERT INTO Artifact (artifactId, artifactName, artifactType, developer, deployer, reportId)
VALUES 
(1, 'WebApp v1.0', 'Web Application', 'DevTeam A', 'OpsTeam B', 1),
(2, 'API Server v2.1', 'API', 'DevTeam B', 'OpsTeam A', 2);

-- Sample data for Vul_phase
INSERT INTO Vul_phase (phId, phase, description, reportId)
VALUES 
(1, 'Development', 'Phase in which the vulnerability was introduced.', 1),
(2, 'Deployment and Use', 'Phase during which the vulnerability was discovered.', 2);

-- Sample data for Attribute_type
INSERT INTO Attribute_type (attributeTypeId, attributeName, attributeValue, phId)
VALUES 
(1, 'Accuracy', TRUE, 1),
(2, 'Privacy', FALSE, 2);

-- Sample data for Attribute_desc
INSERT INTO Attribute_desc (descId, attributeTypeId, description)
VALUES 
(1, 1, 'The system accurately identifies the vulnerability.'),
(2, 2, 'The system does not protect user privacy.');

-- Sample data for Effect_type
INSERT INTO Effect_type (effectTypeId, effectName, effectValue, phId)
VALUES 
(1, '0: Correct functioning', TRUE, 1),
(2, '3: Random actions', FALSE, 2);

-- Sample data for Effect_desc
INSERT INTO Effect_desc (descId, effectTypeId, description)
VALUES 
(1, 1, 'The system functions correctly under normal conditions.'),
(2, 2, 'The system exhibits random actions when exploited.');

-- Sample data for Attachments
INSERT INTO Attachments (infoId, artifactId, attachments)
VALUES 
(1, 1, decode('48656c6c6f20576f726c64', 'hex')), -- 'Hello World' in hex
(2, 2, decode('53616d706c652046696c6520436f6e74656e74', 'hex')); -- 'Sample File Content' in hex

SELECT * FROM 	Reporter;

SELECT * FROM Artifact;