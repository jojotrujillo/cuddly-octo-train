CREATE TABLE ActiveDirectoryUsers (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    pernr TEXT NOT NULL,
    businessPhone TEXT NULL,
    mobilePhone TEXT NULL,
    email2 TEXT NULL
);

CREATE TABLE DropdownConfigs (
    dropdownConfigKey INTEGER PRIMARY KEY AUTOINCREMENT,
    dropdownDisplayType TEXT NULL,
    itemDisplayName TEXT NULL,
    categoryName TEXT NULL,
    isItemActive INTEGER NOT NULL
);

CREATE TABLE ResourcePlanContacts (
    resourcePlanContactKey INTEGER PRIMARY KEY AUTOINCREMENT,
    resourcePlanKey INTEGER NOT NULL,
    roleDropdownConfigKey INTEGER NOT NULL,
    disciplineDropdownConfigKey INTEGER NOT NULL,
    zipperLevelDropdownConfigKey INTEGER NOT NULL,
    districtKey INTEGER NOT NULL,
    pernr TEXT NULL,
    name TEXT NOT NULL,
    phoneNumber TEXT NULL,
    email TEXT NULL,
    insertDate DATETIME NULL,
    updateDate DATETIME NULL,
    lastUser TEXT NULL
);

INSERT INTO ActiveDirectoryUsers VALUES (1, 'John', 'Doe', 'john.doe@thisone.com', '123456', '531-555-5577', '402-555-5555', 'john.doe@example.com');
INSERT INTO ActiveDirectoryUsers VALUES (2, 'Jane', 'Doe', 'jane.doe@thisone.com', '123457', '531-555-5578', '402-555-5556', 'jane.doe@example.com');
INSERT INTO ActiveDirectoryUsers VALUES (3, 'John', 'Smith', 'john.smith@wrongone.com', '123458', '531-555-5579', '402-555-5557', 'john.smith@rightone.com');
INSERT INTO ActiveDirectoryUsers VALUES (4, 'Jane', 'Smith', 'jane.smith@wrongone.com', '123459', '531-555-5580', '402-555-5558', 'jane.smith@rightone.com');
INSERT INTO ActiveDirectoryUsers VALUES (5, 'Peter', 'Cottontail', 'peter.cottontail@wrongone.com', '123460', '531-555-4480', '402-555-5560', 'peter.cottontail@rightone.com');
INSERT INTO ActiveDirectoryUsers VALUES (6, 'Roger', 'Fuzzball', 'roger.fuzzball@wrongone.com', '3460', NULL, '402-555-5560', 'roger.fuzzball@rightone.com');
INSERT INTO ActiveDirectoryUsers VALUES (7, 'Charles', 'Croker', 'charles.croker@wrongone.com', '83460', NULL, NULL, 'charles.croker@rightone.com');

INSERT INTO DropdownConfigs VALUES (1, 'Role', 'Lead District', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (2, 'Role', 'Job Team', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (3, 'Role', 'Engineering', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (4, 'Role', 'Participant District', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (5, 'Role', 'External - Client', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (6, 'Role', 'External - Engineering', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (7, 'Discipline', 'Project Management', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (8, 'Discipline', 'Design Oversight', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (9, 'Discipline', 'Removals and Demolition', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (10, 'Discipline', 'Grading', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (11, 'Discipline', 'Civil Utilities', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (12, 'Discipline', 'Aggregates and Paving', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (13, 'Zipper level', 'Construction Manager', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (14, 'Zipper level', 'Project Engineer', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (15, 'Zipper level', 'Project Manager', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (16, 'Zipper level', 'Sponsor', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (17, 'Zipper level', 'Lead Field Engineer', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (18, 'Zipper level', 'Superintendent', 'ResourcePlanContact', 1);
INSERT INTO DropdownConfigs VALUES (19, 'District', 'Eastern', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (20, 'District', 'Central', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (21, 'District', 'Australia', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (22, 'District', 'Eastern Canada', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (23, 'District', 'Energy Group Quality', 'Staff', 1);
INSERT INTO DropdownConfigs VALUES (24, 'District', 'Underground', 'Staff', 1);

INSERT INTO ResourcePlanContacts VALUES (1, 1, 1, 7, 18, 19, '123456', 'John Doe', '531-555-5577', 'john.doe@example.com', '2021-01-01', '2021-01-01', 'admin');
INSERT INTO ResourcePlanContacts VALUES (2, 1, 2, 8, 14, 20, '123457', 'Jane Doe', '531-555-5578', 'jane.doe@exaample.com', '2021-01-01', '2021-01-01', 'admin');
INSERT INTO ResourcePlanContacts VALUES (3, 1, 5, 9, 13, 21, '123458', 'John Smith', '531-555-5579', 'john.smith@rightone.com', '2021-01-01', '2021-01-01', 'admin');
INSERT INTO ResourcePlanContacts VALUES (4, 1, 6, 10, 17, 22, '123459', 'Jane Smith', '531-555-5580', 'jane.smith@rightone.com', '2021-01-01', '2021-01-01', 'admin');
INSERT INTO ResourcePlanContacts VALUES (5, 1, 3, 11, 13, 23, '123460', 'Peter Cottontail', '531-555-4480', 'peter.cottontail@rightone.com', '2021-01-01', '2021-01-01', 'admin');
INSERT INTO ResourcePlanContacts VALUES (6, 1, 3, 12, 16, 24, '3460', 'Roger Rabbit', NULL, NULL, '2021-01-01', '2021-01-01', 'admin');
INSERT INTO ResourcePlanContacts VALUES (7, 1, 4, 7, 13, 23, '83460', 'Charlie Croker', '602-555-1234', NULL, '2021-01-01', '2021-01-01', 'admin');
INSERT INTO ResourcePlanContacts VALUES (8, 1, 3, 8, 18, 22, '3465', 'Millennium Falcon', '602-695-8788', 'millennium.falcon@aol.com', '2021-01-01', '2021-01-01', 'admin');

/* Example queries
update ResourcePlanContacts set roleDropdownConfigKey = 4 where resourcePlanContactKey = 3;
update ResourcePlanContacts set roleDropdownConfigKey = 5 where resourcePlanContactKey = 4;
update ActiveDirectoryUsers set lastName = 'Conway' where userId = 4;
*/
