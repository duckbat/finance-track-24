-- Drop the database if it exists and then create it
DROP DATABASE IF EXISTS FinanceTrackApp;
CREATE DATABASE FinanceTrackApp;
USE FinanceTrackApp;

-- Create the tables

-- Userlevel table (Moderator, User, Guest, etc.)
CREATE TABLE UserLevels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

-- Category table
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    icon VARCHAR(255) NOT NULL -- Store icon information
);

-- Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_pic VARCHAR(255),
    level_id INT,
    FOREIGN KEY (level_id) REFERENCES UserLevels(level_id)
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


-- Insert data into the tables

-- Insert sample data into UserLevels table
INSERT INTO UserLevels (level_name) VALUES
('Moderator'),
('User'),
('Guest');

-- Insert sample data into Categories table
INSERT INTO Categories (category_name, icon) VALUES
('Food', 'food_icon.png'),
('Entertainment', 'entertainment_icon.png'),
('Transportation', 'transportation_icon.png');

-- Insert sample data into Users table
INSERT INTO Users (username, password, email, profile_pic, level_id) VALUES
('user1', 'password1', 'user1@example.com', 'profile1.jpg', 2),
('user2', 'password2', 'user2@example.com', 'profile2.jpg', 2),
('moderator1', 'password3', 'moderator1@example.com', 'moderator_profile.jpg', 1);

-- Insert sample data into Transactions table
INSERT INTO Transactions (user_id, amount, title, description, filename, filesize, media_type, category_id) VALUES
(1, 50.00, 'Dinner with friends', 'Had dinner with friends at a restaurant.', 'receipt1.jpg', 1024, 'image/jpeg', 1),
(2, 25.00, 'Movie tickets', 'Bought tickets for a movie night.', 'ticket1.pdf', 2048, 'application/pdf', 2),
(1, 20.00, 'Bus fare', 'Paid for bus fare to commute to work.', NULL, NULL, NULL, 3);

-- Insert sample data into Friends table
INSERT INTO Friends (user_id1, user_id2, status) VALUES
(1, 2, 'accepted'),
(2, 3, 'pending');

-- Insert sample data into Comments table
INSERT INTO Comments (transaction_id, user_id, comment_text) VALUES
(1, 2, 'Sounds like a fun night out!'),
(2, 1, 'Enjoy the movie!');

-- Insert sample data into Likes table
INSERT INTO Likes (transaction_id, user_id) VALUES
(1, 2),
(2, 1);
