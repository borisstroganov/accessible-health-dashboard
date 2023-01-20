CREATE TABLE IF NOT EXISTS user
(
    id       TEXT NOT NULL,
    email    TEXT NOT NULL,
    name     TEXT NOT NULL,
    password TEXT NOT NULL,

    PRIMARY KEY (id)
);