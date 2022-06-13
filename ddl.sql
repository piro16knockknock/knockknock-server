
CREATE TABLE test
(
    `id`      INT NOT NULL AUTO_INCREMENT,
    `key`     VARCHAR(100) NOT NULL,
    `value`   VARCHAR(100),
    PRIMARY KEY (`id`)
);

CREATE TABLE Home
(
    `homeId`   INT NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(50) UNIQUE,
    `rentDate` INT,
    `rentMonth` INT,
    PRIMARY key (`homeId`)
);

CREATE TABLE User 
(
    `userPk`   INT NOT NULL AUTO_INCREMENT,
    `userId`   VARCHAR(30) NOT NULL,
    `password`  VARCHAR(200) NOT NULL,
    `name`      VARCHAR(20) NOT NULL,
    `gender`    VARCHAR(20),
    `nickname`  VARCHAR(20),
    `homeId`   INT,
    `profileImage` BLOB,
    `titleId`  INT,
    `testId`   INT,
    PRIMARY key (`userPk`),
    FOREIGN KEY (`homeId`) REFERENCES `Home` (`homeId`)
);
/*
    FOREIGN KEY (`title_id`) REFERENCES `title` (`title_id`),
    FOREIGN KEY (`test_id`) REFERENCES `test_result` (`test_id`)
*/

CREATE TABLE Alert
(
    `alertId`  INT NOT NULL AUTO_INCREMENT,
    `content`   VARCHAR(50) NOT NULL,
    `alertAt`  TIMESTAMP   NOT NULL,
    `userPk`   INT NOT NULL,
    PRIMARY KEY (`alertId`),
    FOREIGN KEY (`userPk`) REFERENCES `User` (`userPk`)
);



CREATE TABLE PastHome
(
    `userPk` INT NOT NULL,
    `homeId2` INT NOT NULL,
    `startDate` INT,
    `endDate`  INT,
    FOREIGN KEY (`userPk`) REFERENCES `User` (`userPk`),
    FOREIGN KEY (`homeId2`) REFERENCES `Home` (`homeId`)
);

CREATE TABLE Residence
(
    `residenceId`  INT NOT NULL AUTO_INCREMENT,
    `homeId`   INT NOT NULL,
    `nation`    VARCHAR(50),
    `city`      VARCHAR(50),
    `adress`    VARCHAR(100),
    PRIMARY KEY (`residenceId`),
    FOREIGN KEY (`homeId`) REFERENCES `Home` (`homeId`)
);

CREATE TABLE Rulecategory 
(
    `rulecateId`   INT NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(30) NOT NULL,
    PRIMARY KEY (`rulecateId`)
);

CREATE TABLE Rule
(
    `ruleId`   INT NOT NULL AUTO_INCREMENT,
    `homeId`   INT NOT NULL,
    `content`   VARCHAR(50) NOT NULL,
    `rulecateId`   INT,
    PRIMARY KEY (`ruleId`),
    FOREIGN KEY (`rulecateId`) REFERENCES `Rulecategory` (`rulecateId`)
);
/*
CREATE TABLE Guideline 
(
    `guide_id`  INT NOT NULL AUTO_INCREMENT,
    `guid_q`    VARCHAR(50),
    `guid_check`    INT,
    `rule_id`   INT NOT NULL,
    `home_id2`  INT NOT NULL,
    PRIMARY KEY (`guide_id`),
    FOREIGN KEY (`rule_id`) REFERENCES `Rule` (`rule_id`),
    FOREIGN KEY (`home_id2`) REFERENCES `Rule` (`home_id`)
);
*/

CREATE TABLE Utility 
(
    `utilityId`    INT NOT NULL AUTO_INCREMENT,
    `homeId`   INT NOT NULL,
    `name`  VARCHAR(30),
    `utilityDate`  INT,
    `utilityMonth` INT,
    PRIMARY KEY (`utilityId`),
    FOREIGN KEY (`homeId`) REFERENCES `Home` (`homeId`)
);

/*
CREATE TABLE test_result
(
    `test_id` INT NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(20) NOT NULL,
    `content` VARCHAR(300) NOT NULL,
    PRIMARY KEY (`test_id`)
);


CREATE TABLE title 
(
    `title_id` INT NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(30) NOT NULL,
    `user_pk`   INT NOT NULL,
    PRIMARY KEY (`title_id`),
    FOREIGN KEY (`user_pk`) REFERENCES `User` (`user_pk`)
);
*/

CREATE TABLE Roommateinvite
(
    `inviteId` INT NOT NULL AUTO_INCREMENT,
    `homeId`   INT NOT NULL,
    `userPk`   INT NOT NULL,
    `invitedTime`    TIMESTAMP,
    `inviteLink`   VARCHAR(100),
    `isAcceptd`    boolean DEFAULT NULL,
    PRIMARY KEY(`inviteId`),
    FOREIGN KEY(`homeId`) REFERENCES `Home` (`homeId`),
    FOREIGN KEY(`userPk`)  REFERENCES `User` (`userPk`)
);

CREATE TABLE TODOCategory
(
    `cateId` INT NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(20) NOT NULL,
    `homeId`   INT NOT NULL,
    PRIMARY KEY (`cateId`),
    FOREIGN KEY (`homeId`) REFERENCES `Home` (`homeId`)
);
/*
    `user_pk`   INT NOT NULL,
    FOREIGN KEY (`user_pk`) REFERENCES `User` (`user_id`),
*/
CREATE TABLE TODO
(
    `todoId` INT NOT NULL AUTO_INCREMENT,
    `todoContent` VARCHAR(100) NOT NULL,
    `date` TIMESTAMP,
    `cateId` INT,
    `userPk` INT NOT NULL,
    `isCompleted` boolean DEFAULT NULL,
    PRIMARY KEY(`todoId`),
    FOREIGN KEY(`cateId`) REFERENCES `TODOCategory` (`cateId`),
    FOREIGN KEY(`userPk`) REFERENCES `User` (`userPk`)
);
/* 
    `home_id` INT NOT NULL,
    FOREIGN KEY(`home_id`) REFERENCES `Home` (`home_id`),
*/

/*
CREATE TABLE Feedback
(
    `user_pk`   INT NOT NULL,
    `todo_id`   INT NOT NULL,
    `type`  INT NOT NULL,
    FOREIGN KEY (`user_pk`) REFERENCES `User` (`user_pk`),
    FOREIGN KEY (`todo_id`) REFERENCES `TODO` (`todo_id`)
);
*/