-- Drop the database if it exists and then create it
DROP DATABASE IF EXISTS FinanceTrackApp;
CREATE DATABASE FinanceTrackApp;
USE FinanceTrackApp;

-- Create the tables

-- Userlevel table (Moderator, User, Guest, etc.)
CREATE TABLE UserLevels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL,
);

-- Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_pic VARCHAR(255),
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
);

-- Transactions table
CREATE TABLE Transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,

);

-- Category table
CREATE TABLE

-- Friends table

-- Comments tableq

-- Likes table



-- Sample data
