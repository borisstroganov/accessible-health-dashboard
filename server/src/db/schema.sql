CREATE TABLE IF NOT EXISTS user
(
    id       TEXT NOT NULL,
    email    TEXT NOT NULL,
    name     TEXT NOT NULL,
    password TEXT NOT NULL,

    PRIMARY KEY (email)
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