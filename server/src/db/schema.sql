CREATE TABLE IF NOT EXISTS user
(
    id             TEXT NOT NULL,
    email          TEXT NOT NULL,
    name           TEXT NOT NULL,
    password       TEXT NOT NULL,
    therapistEmail TEXT,

    PRIMARY KEY (email),
    FOREIGN KEY (therapistEmail) REFERENCES therapist (email)
);
CREATE TABLE IF NOT EXISTS therapist
(
    id       TEXT NOT NULL,
    email    TEXT NOT NULL,
    name     TEXT NOT NULL,
    password TEXT NOT NULL,

    PRIMARY KEY (email)
);
CREATE TABLE IF NOT EXISTS invitation
(
    userEmail      TEXT NOT NULL,
    therapistEmail TEXT NOT NULL,

    PRIMARY KEY (userEmail, therapistEmail),
    FOREIGN KEY (userEmail) REFERENCES user (email),
    FOREIGN KEY (therapistEmail) REFERENCES therapist (email)
);
CREATE TABLE IF NOT EXISTS assignment
(
    userEmail       TEXT NOT NULL,
    therapistEmail  TEXT NOT NULL,
    assignmentTitle TEXT NOT NULL,
    assignmentText  TEXT NOT NULL,
    status          TEXT NOT NULL,
    feedbackText    TEXT NOT NULL,
    speechId        TEXT NOT NULL,

    PRIMARY KEY (userEmail, therapistEmail),
    FOREIGN KEY (userEmail) REFERENCES user (email),
    FOREIGN KEY (therapistEmail) REFERENCES therapist (email),
    FOREIGN KEY (speechId) REFERENCES speechRate (speechId)
);
CREATE TABLE IF NOT EXISTS bloodPressure
(
    bpId              TEXT     NOT NULL,
    systolicPressure  INTEGER  NOT NULL,
    diastolicPressure INTEGER  NOT NULL,
    date              DATETIME NOT NULL,
    userEmail         TEXT     NOT NULL,

    PRIMARY KEY (bpId),
    FOREIGN KEY (userEmail) REFERENCES user (email)
);
CREATE TABLE IF NOT EXISTS heartRate
(
    hrId      TEXT     NOT NULL,
    hr        INTEGER  NOT NULL,
    date      DATETIME NOT NULL,
    userEmail TEXT     NOT NULL,

    PRIMARY KEY (hrId),
    FOREIGN KEY (userEmail) REFERENCES user (email)
);
CREATE TABLE IF NOT EXISTS speechRate
(
    speechId  TEXT     NOT NULL,
    wpm       INTEGER  NOT NULL,
    accuracy  INTEGER  NOT NULL,
    date      DATETIME NOT NULL,
    userEmail TEXT     NOT NULL,

    PRIMARY KEY (speechId),
    FOREIGN KEY (userEmail) REFERENCES user (email)
);