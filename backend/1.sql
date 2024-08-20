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

-- Create table Reporter
CREATE TABLE Reporter (
    reporterId SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    organization VARCHAR(255),
	salt VARCHAR(255),
	password VARCHAR(255)
);

ALTER TABLE Reporter
	ADD COLUMN salt VARCHAR(255);

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

-- -- Create table Effect
-- CREATE TABLE Effect (
--     effectTypeId SERIAL PRIMARY KEY,
--     eff_description VARCHAR(510),
--     phId INTEGER,
--     FOREIGN KEY (phId) REFERENCES Vul_phase(phId)
-- );

-- -- Create table Effect_names
-- CREATE TABLE Effect_names (
--     effectId SERIAL PRIMARY KEY,
--     effectName effect_enum
-- );

-- --Create table All_effects for the multiple selection with many-to-many connection
-- CREATE TABLE All_effects (
--     effectTypeId INTEGER,
--     effectId INTEGER,
--     FOREIGN KEY (effectTypeId) REFERENCES Effect(effectTypeId),
--     FOREIGN KEY (effectId) REFERENCES Effect_names(effectId),
--     PRIMARY KEY (effectTypeId, effectId)
-- );

DROP TABLE artifact, attachments, attribute, attribute_names, all_attributes, effect, reporter, vul_phase, vul_report CASCADE;



-- Drop the Effect_names and All_effects tables as they are no longer needed
DROP TABLE Effect CASCADE;
DROP TABLE IF EXISTS Effect_names CASCADE;
DROP TABLE IF EXISTS All_effects CASCADE;


-- Sample data for Reporter
INSERT INTO Reporter (name, email, organization)
VALUES 
('John Doe', 'john.doe@example.com', 'CyberSec Inc.'),
('Jane Smith', 'jane.smith@example.com', 'SecureTech');

SELECT * FROM 	Reporter;

-- Sample data for Vul_report
INSERT INTO Vul_report (title, report_description, reporterId)
VALUES 
('SQL Injection Vulnerability', 'A SQL injection vulnerability in the login form.', 1),
('Cross-Site Scripting', 'A persistent XSS vulnerability in the comment section.', 2);

SELECT * FROM Vul_report;

-- Sample data for Artifact
INSERT INTO Artifact (artifactName, artifactType, developer, deployer, reportId)
VALUES 
('WebApp v1.0', 'Web Application', 'DevTeam A', 'OpsTeam B', 1),
('API Server v2.1', 'API', 'DevTeam B', 'OpsTeam A', 2);

SELECT * FROM Artifact;

-- Sample data for Vul_phase
INSERT INTO Vul_phase (phase, phase_description, reportId)
VALUES 
('Development', 'Phase in which the vulnerability was introduced.', 1),
('Deployment and Use', 'Phase during which the vulnerability was discovered.', 2);

SELECT * FROM Vul_phase;

-- Sample data for Attribute_type
INSERT INTO Attribute (attr_description, phId)
VALUES 
('Accuracy', 1),
('Privacy', 2);

SELECT * FROM Attribute_type;

-- Sample data for Attribute_desc
INSERT INTO Attribute_desc (attributeTypeId, attr_description)
VALUES 
(1, 'The system accurately identifies the vulnerability.'),
(2, 'The system does not protect user privacy.');

SELECT * FROM Attribute_desc;

-- Sample data for Effect_type
INSERT INTO Effect_type (effectName, effectValue, phId)
VALUES 
('0: Correct functioning', TRUE, 1),
('3: Random actions', TRUE, 2);

SELECT * FROM Effect_type;

-- Sample data for Effect_desc
INSERT INTO Effect_desc (effectTypeId, eff_description)
VALUES 
(1, 'The system functions correctly under normal conditions.'),
(2, 'The system exhibits random actions when exploited.');

SELECT * FROM Effect_desc;


-- Sample data for Attachments
-- INSERT INTO Attachments (artifactId, attachments)
-- VALUES 
-- (1, decode('48656c6c6f20576f726c64', 'hex')), 
-- (2, decode('53616d706c652046696c6520436f6e74656e74', 'hex')); 

-- Inserting sample data into the Attachments table

INSERT INTO Attachments (artifactId, attachments, filename, mimeType)
VALUES
(1, '\\x89504e470d0a1a0a0000000d494844520000001000000010080200000059f4d9a000000017352474200aece1ce90000000467414d410000b18f0bfc6100000001c674c410000b18f0bfc61000000000467414d410000b18f0bfc61000000000467414d410000b18f0bfc6100000000', 'example_image.png', 'image/png');

SELECT * FROM Attachments;

UPDATE Attachments 
	SET filename = 'file1.pdf', mimetype = 'application/pdf'
	WHERE infoid = 1;
	

SELECT 
        v.reportId AS id, 
        v.title, 
        a.artifactName 
      FROM 
        Vul_report v
      JOIN 
        Artifact a ON v.reportId = a.reportId

SELECT * 
	FROM Vul_report v
	JOIN 
    Artifact a ON v.artifactId = a.artifactId;

SELECT * FROM Vul_report v JOIN Artifact a ON v.artifactId = a.artifactId

SELECT 
            v.reportId AS id, 
            v.title, 
            v.report_description,
            a.artifactName,
            r.name AS reporterName,
            r.email AS reporterEmail,
            r.organization AS reporterOrganization,
            p.phase,
            p.phase_description AS phaseDescription,
            encode(at.attachments, 'base64') AS attachments,
            at.filename AS attachmentFilename,
            at.mimeType AS attachmentMimeType
        FROM 
            Vul_report v
        JOIN 
            Artifact a ON v.reportId = a.reportId
        JOIN 
            Reporter r ON v.reporterId = r.reporterId
        JOIN 
            Vul_phase p ON v.reportId = p.reportId
        LEFT JOIN 
            Attachments at ON a.artifactId = at.artifactId;


-- Clear existing data
DELETE FROM Vul_report;

-- Insert sample data
INSERT INTO Vul_report (title, description, artifactId, reporterId, phId, date_added, date_updated)
VALUES 
('SQL Injection', 'An SQL injection vulnerability allows attackers to execute arbitrary SQL code on the database.', 1, 1, 1, '2024-01-01T10:00:00Z', '2024-01-01T10:00:00Z'),
('Cross-Site Scripting (XSS)', 'An XSS vulnerability allows attackers to inject malicious scripts into web pages.', 2, 2, 2, '2024-02-01T11:00:00Z', '2024-02-01T11:00:00Z'),
('Buffer Overflow', 'A buffer overflow vulnerability allows attackers to overwrite memory and execute arbitrary code.', 3, 3, 3, '2024-03-01T12:00:00Z', '2024-03-01T12:00:00Z'),
('Insecure Direct Object References', 'An insecure direct object reference vulnerability allows attackers to access unauthorized resources.', 4, 4, 4, '2024-04-01T13:00:00Z', '2024-04-01T13:00:00Z'),
('Cross-Site Request Forgery (CSRF)', 'A CSRF vulnerability allows attackers to perform actions on behalf of authenticated users.', 5, 5, 5, '2024-05-01T14:00:00Z', '2024-05-01T14:00:00Z'),
('Remote Code Execution (RCE)', 'An RCE vulnerability allows attackers to execute arbitrary code on the server.', 6, 6, 6, '2024-06-01T15:00:00Z', '2024-06-01T15:00:00Z'),
('Privilege Escalation', 'A privilege escalation vulnerability allows attackers to gain higher privileges on the system.', 7, 7, 7, '2024-07-01T16:00:00Z', '2024-07-01T16:00:00Z'),
('Directory Traversal', 'A directory traversal vulnerability allows attackers to access restricted directories and files.', 8, 8, 8, '2024-08-01T17:00:00Z', '2024-08-01T17:00:00Z'),
('Information Disclosure', 'An information disclosure vulnerability allows attackers to access sensitive information.', 9, 9, 9, '2024-09-01T18:00:00Z', '2024-09-01T18:00:00Z'),
('Insecure Deserialization', 'An insecure deserialization vulnerability allows attackers to execute arbitrary code during the deserialization process.', 10, 10, 10, '2024-10-01T19:00:00Z', '2024-10-01T19:00:00Z');

-- Additional sample data
INSERT INTO Vul_report (title, description, artifactId, reporterId, phId, date_added, date_updated)
VALUES 
('Weak Password Policy', 'A weak password policy vulnerability allows attackers to easily guess or crack passwords.', 11, 11, 11, '2024-11-01T20:00:00Z', '2024-11-01T20:00:00Z'),
('Man-in-the-Middle (MITM) Attack', 'A MITM vulnerability allows attackers to intercept and manipulate communication between two parties.', 12, 12, 12, '2024-12-01T21:00:00Z', '2024-12-01T21:00:00Z'),
('Unvalidated Redirects and Forwards', 'An unvalidated redirects and forwards vulnerability allows attackers to redirect users to malicious sites.', 13, 13, 13, '2024-01-15T10:00:00Z', '2024-01-15T10:00:00Z'),
('Security Misconfiguration', 'A security misconfiguration vulnerability allows attackers to exploit improperly configured systems.', 14, 14, 14, '2024-02-15T11:00:00Z', '2024-02-15T11:00:00Z'),
('Using Components with Known Vulnerabilities', 'A vulnerability arising from using components with known security issues.', 15, 15, 15, '2024-03-15T12:00:00Z', '2024-03-15T12:00:00Z'),
('Insufficient Logging and Monitoring', 'A lack of logging and monitoring can allow attackers to perform actions without being detected.', 16, 16, 16, '2024-04-15T13:00:00Z', '2024-04-15T13:00:00Z'),
('Denial of Service (DoS)', 'A DoS vulnerability allows attackers to disrupt the availability of a service.', 17, 17, 17, '2024-05-15T14:00:00Z', '2024-05-15T14:00:00Z'),
('Insufficient Transport Layer Protection', 'A vulnerability where data transmitted over the network is not properly encrypted.', 18, 18, 18, '2024-06-15T15:00:00Z', '2024-06-15T15:00:00Z'),
('Open Redirect', 'An open redirect vulnerability allows attackers to redirect users to an untrusted site.', 19, 19, 19, '2024-07-15T16:00:00Z', '2024-07-15T16:00:00Z'),
('LDAP Injection', 'An LDAP injection vulnerability allows attackers to manipulate LDAP queries and access unauthorized information.', 20, 20, 20, '2024-08-15T17:00:00Z', '2024-08-15T17:00:00Z');

        

    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


-- Sample data for Attribute
INSERT INTO Attribute (attr_description, phId) VALUES 
('Accuracy of the system', 1),
('Fairness of the system', 2);

SELECT * FROM Attribute;

-- Sample data for Attribute_names
INSERT INTO Attribute_names (attributeName) VALUES 
('Accuracy'),
('Fairness'),
('Privacy'),
('Reliability'),
('Resiliency'),
('Robustness'),
('Safety');

SELECT * FROM Attribute_names;

-- Sample data for All_attributes
INSERT INTO All_attributes (attributeTypeId, attributeId) VALUES 
(6, 10), -- Accuracy of the system
(7, 12); -- Fairness of the system
;
SELECT * FROM All_attributes;

-- Sample data for Effect
INSERT INTO Effect (eff_description, phId) VALUES 
('System functions correctly', 1),
('System has reduced functionality', 2);

SELECT * FROM Effect;

-- Sample data for Effect_names
INSERT INTO Effect_names (effectName) VALUES 
('0: Correct functioning'),
('1: Reduced functioning'),
('2: No actions'),
('3: Random actions'),
('4: Directed actions'),
('5: Random actions OoB'),
('6: Directed actions OoB');

SELECT * FROM Effect_names;


-- Sample data for All_effects
INSERT INTO All_effects (effectTypeId, effectId) VALUES 
(1, 6), -- System functions correctly
(2, 4); -- System has reduced functionality

select * from All_effects;

SELECT 
                v.reportId AS id, 
                v.title, 
                v.report_description,
                a.artifactName,
                a.artifactType,
                a.developer, 
                a.deployer, 
                a.artifactId, 
                r.reporterId,
                r.name AS reporterName,
                r.email AS reporterEmail,
                r.organization AS reporterOrganization,
                p.phase,
                p.phase_description AS phaseDescription,
                array_agg(DISTINCT an.attributeName) AS attributes,
                attr.attr_description AS attr_Description,
                eff.effectName AS effect,
                eff.eff_description AS eff_Description,
                array_agg(DISTINCT att.attachments) AS attachments,
                array_agg(DISTINCT att.filename) AS attachmentFilenames,
                array_agg(DISTINCT att.mimeType) AS attachmentMimeTypes
            FROM 
                Vul_report v
            JOIN 
                Artifact a ON v.reportId = a.reportId
            JOIN 
                Reporter r ON v.reporterId = r.reporterId
            JOIN 
                Vul_phase p ON v.reportId = p.reportId
            LEFT JOIN 
                All_attributes aa ON p.phId = aa.attributeTypeId
            LEFT JOIN 
                Attribute_names an ON aa.attributeId = an.attributeId
            LEFT JOIN 
                Attribute attr ON p.phId = attr.phId
            LEFT JOIN 
                Effect eff ON p.phId = eff.phId
            LEFT JOIN 
                Attachments att ON a.artifactId = att.artifactId
            GROUP BY 
                v.reportId, a.artifactName, a.artifactType, a.developer, a.deployer, a.artifactId, r.reporterId, r.name, r.email, r.organization, p.phase, p.phase_description, attr.attr_description, eff.effectName, eff.eff_description
        
	 
SELECT n.nspname as "Schema",
       t.typname as "Name",
       t.typtype as "Type",
       e.enumlabel as "Enum Value"
FROM pg_type t 
JOIN pg_enum e 
  ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n 
  ON n.oid = t.typnamespace
WHERE t.typname = 'effect_enum';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Effect';

CREATE DATABASE copy_DB WITH TEMPLATE aivtdb OWNER postgres;
