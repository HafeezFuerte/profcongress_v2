CREATE TABLE `contact` (
  `contactId` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(1000) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `prefix` varchar(10) NOT NULL,
  `area` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `groupId` bigint NOT NULL,
  `createdTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`contactId`),
  KEY `fk_contact_groupId` (`groupId`)
)
CREATE TABLE `campaign` (
  `campaignId` bigint NOT NULL AUTO_INCREMENT,
  `state` varchar(255) NOT NULL,
  `area` varchar(255) DEFAULT NULL,
  `campaignName` varchar(255) DEFAULT NULL,
  `campaignDescription` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `media` json DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdBy` bigint NOT NULL,
  PRIMARY KEY (`campaignId`),
  KEY `fk_campaign_createdBy` (`createdBy`),
  CONSTRAINT `fk_campaign_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`)
);

CREATE TABLE `contactGroup` (
  `groupId` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(1000) NOT NULL,
  `prefix` varchar(1000) NOT NULL,
  `state` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` bigint NOT NULL,
  `isSync` tinyint NOT NULL DEFAULT '0',
  `syncedBy` bigint DEFAULT NULL,
  PRIMARY KEY (`groupId`),
  KEY `fk_group_createdBy` (`createdBy`),
  KEY `fk_contactGroup_syncedBy` (`syncedBy`),
  CONSTRAINT `fk_contactGroup_syncedBy` FOREIGN KEY (`syncedBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_group_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`)
)
CREATE TABLE `user` (
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `usertype` int DEFAULT '2',
  `salt` varchar(1000) NOT NULL,
  `userId` bigint NOT NULL AUTO_INCREMENT,
  `notificationCount` int DEFAULT '0',
  `createdBy` bigint DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` tinyint(1) DEFAULT '1',
  `rawPassword` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `fk_createdBy` (`createdBy`),
  KEY `idx_name` (`name`),
  KEY `idx_userId` (`userId`),
  CONSTRAINT `fk_createdBy` FOREIGN KEY (`createdBy`) REFERENCES `user` (`userId`),
  CONSTRAINT `user_chk_1` CHECK ((`usertype` between 1 and 9))
);