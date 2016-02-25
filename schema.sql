DROP DATABASE IF EXISTS pound;
CREATE DATABASE pound;

\connect pound;

CREATE TABLE puppies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    age INT NOT NULL CHECK(age BETWEEN 0 AND 25),
    sex VARCHAR(20) NOT NULL
);


INSERT INTO puppies (name, breed, age, sex) VALUES ('Tyler', 'Shih-tzu', 3, 'M');
