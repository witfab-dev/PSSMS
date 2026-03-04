-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS `PSSMS`;
USE `PSSMS`;

-- 2. Users Table (For Login/Authentication)
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Car Table (Requirement 8)
CREATE TABLE IF NOT EXISTS `car` (
  `PlateNumber` varchar(20) NOT NULL,
  `DriverName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  PRIMARY KEY (`PlateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Parking Slot Table (Requirement 8)
CREATE TABLE IF NOT EXISTS `parkingslot` (
  `SlotNumber` int(11) NOT NULL,
  `SlotStatus` varchar(20) NOT NULL DEFAULT 'Available',
  PRIMARY KEY (`SlotNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Parking Record Table (The Core Transaction Table)
CREATE TABLE IF NOT EXISTS `parkingrecord` (
  `RecordID` int(11) NOT NULL AUTO_INCREMENT,
  `EntryTime` datetime NOT NULL,
  `ExitTime` datetime DEFAULT NULL,
  `Duration` int(11) DEFAULT NULL,
  `SlotNumber` int(11) NOT NULL,
  `PlateNumber` varchar(20) NOT NULL,
  PRIMARY KEY (`RecordID`),
  -- Relationships
  CONSTRAINT `fk_slot` FOREIGN KEY (`SlotNumber`) REFERENCES `parkingslot` (`SlotNumber`) ON UPDATE CASCADE,
  CONSTRAINT `fk_car` FOREIGN KEY (`PlateNumber`) REFERENCES `car` (`PlateNumber`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Payment Table (Requirement 12)
CREATE TABLE IF NOT EXISTS `payment` (
  `PaymentID` int(11) NOT NULL AUTO_INCREMENT,
  `AmountPaid` int(11) NOT NULL,
  `PaymentDate` date NOT NULL,
  `RecordID` int(11) NOT NULL,
  PRIMARY KEY (`PaymentID`),
  CONSTRAINT `fk_record` FOREIGN KEY (`RecordID`) REFERENCES `parkingrecord` (`RecordID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --- DEFAULT DATA FOR WITFAB DEV DEMO ---
INSERT INTO `parkingslot` (`SlotNumber`, `SlotStatus`) VALUES 
(1, 'Available'), (2, 'Available'), (3, 'Available'), (4, 'Available'), (5, 'Available');

-- Initial Admin (Password: admin123)
INSERT INTO `users` (`username`, `password`) VALUES 
('admin', '$2b$10$EPZ9S9.t/jA9zO9w.f8z8.7H9fC9jS9.f8z8.7H9fC9jS9.f8z8.');