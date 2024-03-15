-- Drop the database if it exists and then create it
DROP DATABASE IF EXISTS FinanceTrackApp;
CREATE DATABASE FinanceTrackApp;
USE FinanceTrackApp;

-- Create the tables

-- Category table
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

-- Userlevel table (Moderator, User, Guest, etc.)
CREATE TABLE UserLevels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

-- Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_pic VARCHAR(255),
    user_level_id INT,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
);

-- Transactions table
CREATE TABLE Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    filename VARCHAR(255),
    filesize INT,
    media_type VARCHAR(255),
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- Friends table
CREATE TABLE Friends (
    friends_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id1 INT,
    user_id2 INT,
    status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id1) REFERENCES Users(user_id),
    FOREIGN KEY (user_id2) REFERENCES Users(user_id)
);

-- Comments table
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Likes table
CREATE TABLE Likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Ratings table
CREATE TABLE Ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    user_id INT NOT NULL,
    rating_value INT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- TransactionCategories table
CREATE TABLE TransactionCategories (
    transaction_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (transaction_id, category_id),
    FOREIGN KEY (transaction_id) REFERENCES Transactions(transaction_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);


-- ADD mock data

-- Inserting data into UserLevels table
INSERT INTO UserLevels (level_name) VALUES
('Moderator'),
('User'),
('Guest');

-- Inserting data into Users table
INSERT INTO Users (username, password, email, profile_pic, user_level_id) VALUES
('john_doe', 'password123', 'john@example.com', 'profile_pic1.jpg', 2),
('jane_smith', 'abc123', 'jane@example.com', 'profile_pic2.jpg', 2),
('guest_user', 'guestpass', 'guest@example.com', NULL, 3);

-- Inserting data into Categories table
INSERT INTO Categories (category_name) VALUES
('Groceries'),
('Entertainment');

-- Inserting data into Transactions table
INSERT INTO Transactions (user_id, amount, title, description, category_id) VALUES
(1, 50.00, 'Grocery Shopping', 'Bought groceries for the week', 1),
(2, 25.00, 'Movie Night', 'Watched a movie with friends', 2);

-- Inserting data into Friends table
INSERT INTO Friends (user_id1, user_id2, status) VALUES
(1, 2, 'accepted'),
(1, 3, 'pending');

-- Inserting data into Comments table
INSERT INTO Comments (transaction_id, user_id, comment_text) VALUES
(1, 2, 'Nice haul!'),
(2, 1, 'It was a great movie!');

-- Inserting data into Likes table
INSERT INTO Likes (transaction_id, user_id) VALUES
(1, 2),
(2, 1);

-- Inserting data into Ratings table
INSERT INTO Ratings (transaction_id, user_id, rating_value) VALUES
(2, 1, 4),
(2, 2, 5);

-- Inserting data into TransactionCategories table
INSERT INTO TransactionCategories (transaction_id, category_id) VALUES
(1, 1),
(2, 2);
