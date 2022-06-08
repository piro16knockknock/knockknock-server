
CREATE TABLE test
(
    `id`      INT NOT NULL AUTO_INCREMENT,
    `key`     VARCHAR(100) NOT NULL,
    `value`   VARCHAR(100),
    PRIMARY KEY (`id`)
);

CREATE TABLE Home
(
    `home_id`   INT NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(50) UNIQUE,
    `rent_date` INT,
    `rent_month` INT,
    PRIMARY key (`home_id`)
);

CREATE TABLE User 
(
    `user_pk`   INT NOT NULL AUTO_INCREMENT,
    `user_id`   VARCHAR(30) NOT NULL,
    `password`  VARCHAR(200) NOT NULL,
    `name`      VARCHAR(20) NOT NULL,
    `gender`    VARCHAR(20),
    `nickname`  VARCHAR(20),
    `home_id`   INT,
    `profile_image` BLOB,
    `title_id`  INT,
    `test_id`   INT,
    PRIMARY key (`user_pk`),
    FOREIGN KEY (`home_id`) REFERENCES `Home` (`home_id`)
);
/*
    FOREIGN KEY (`title_id`) REFERENCES `title` (`title_id`),
    FOREIGN KEY (`test_id`) REFERENCES `test_result` (`test_id`)
*/

CREATE TABLE Alert
(
    `alert_id`  INT NOT NULL AUTO_INCREMENT,
    `content`   VARCHAR(50) NOT NULL,
    `alert_at`  TIMESTAMP   NOT NULL,
    `user_pk`   INT NOT NULL,
    PRIMARY KEY (`alert_id`),
    FOREIGN KEY (`user_pk`) REFERENCES `User` (`user_pk`)
);



CREATE TABLE Past_Home
(
    `user_pk` INT NOT NULL AUTO_INCREMENT,
    `home_id2` INT NOT NULL,
    `start_date` TIMESTAMP,
    `end_date`  TIMESTAMP,
    FOREIGN KEY (`user_pk`) REFERENCES `User` (`user_pk`),
    FOREIGN KEY (`home_id2`) REFERENCES `Home` (`home_id`)
);

CREATE TABLE Residence
(
    `residence_id`  INT NOT NULL AUTO_INCREMENT,
    `home_id`   INT NOT NULL,
    `nation`    VARCHAR(50),
    `city`      VARCHAR(50),
    `adress`    VARCHAR(100),
    PRIMARY KEY (`residence_id`),
    FOREIGN KEY (`home_id`) REFERENCES `Home` (`home_id`)
);

CREATE TABLE Rule_category 
(
    `rulecate_id`   INT NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(30) NOT NULL,
    PRIMARY KEY (`rulecate_id`)
);

CREATE TABLE Rule
(
    `rule_id`   INT NOT NULL AUTO_INCREMENT,
    `home_id`   INT NOT NULL,
    `content`   VARCHAR(50) NOT NULL,
    `rulecate_id`   INT NOT NULL,
    PRIMARY KEY (`rule_id`),
    FOREIGN KEY (`rulecate_id`) REFERENCES `Rule_category` (`rulecate_id`)
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
    `utility_id`    INT NOT NULL AUTO_INCREMENT,
    `home_id`   INT NOT NULL,
    `name`  VARCHAR(30),
    `utility_date`  INT,
    `utility_month` INT,
    PRIMARY KEY (`utility_id`),
    FOREIGN KEY (`home_id`) REFERENCES `Home` (`home_id`)
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

CREATE TABLE Roommate_invite
(
    `invite_id` INT NOT NULL AUTO_INCREMENT,
    `home_id`   INT NOT NULL,
    `user_pk`   INT NOT NULL,
    `invited_time`    TIMESTAMP,
    `invite_link`   VARCHAR(100),
    `is_acceptd`    boolean DEFAULT NULL,
    PRIMARY KEY(`invite_id`),
    FOREIGN KEY(`home_id`) REFERENCES `Home` (`home_id`),
    FOREIGN KEY(`user_pk`)  REFERENCES `User` (`user_pk`)
);

CREATE TABLE TODO_Category
(
    `cate_id` INT NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(20) NOT NULL,
    `home_id`   INT NOT NULL,
    PRIMARY KEY (`cate_id`),
    FOREIGN KEY (`home_id`) REFERENCES `Home` (`home_id`)
);
/*
    `user_pk`   INT NOT NULL,
    FOREIGN KEY (`user_pk`) REFERENCES `User` (`user_id`),
*/
CREATE TABLE TODO
(
    `todo_id` INT NOT NULL AUTO_INCREMENT,
    `todo_content` VARCHAR(100) NOT NULL,
    `date` TIMESTAMP,
    `cate_id` INT NOT NULL,
    `user_pk` INT NOT NULL,
    `is_completed` boolean DEFAULT NULL,
    PRIMARY KEY(`todo_id`),
    FOREIGN KEY(`cate_id`) REFERENCES `TODO_Category` (`cate_id`),
    FOREIGN KEY(`user_pk`) REFERENCES `User` (`user_pk`)
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