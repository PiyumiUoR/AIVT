-- Create ENUM types
CREATE TYPE phase_enum AS ENUM ('Development', 'Training', 'Deployment and Use');
CREATE TYPE attribute_enum AS ENUM ('Accuracy', 'Fairness', 'Privacy', 'Reliability', 'Resiliency', 'Robustness', 'Safety');
CREATE TYPE effect_enum AS ENUM ('0: Correct functioning', '1: Reduced functioning', '2: No actions', '3: Random actions', '4: Directed actions', '5: Random actions OoB', '6: Directed actions OoB');

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