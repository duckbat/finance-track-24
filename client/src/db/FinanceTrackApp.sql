-- Drop the database if it exists and then create it
DROP DATABASE IF EXISTS FinanceTrackApp;
CREATE DATABASE FinanceTrackApp;
USE FinanceTrackApp;

-- Create the tables

-- Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table

-- Catory table
CREATE TABLE

-- Friends table

-- Comments tableq

-- Likes table


