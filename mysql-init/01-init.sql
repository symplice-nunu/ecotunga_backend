-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ecotunga;

-- Use the database
USE ecotunga;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON ecotunga.* TO 'ecotunga_user'@'%';
FLUSH PRIVILEGES;

-- Set character set and collation
ALTER DATABASE ecotunga CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 