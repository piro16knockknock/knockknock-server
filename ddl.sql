
CREATE TABLE test
(
    `id`      INT NOT NULL AUTO_INCREMENT,
    `key`     VARCHAR(100) NOT NULL,
    `value`   VARCHAR(100),
    PRIMARY KEY (`id`)
);

CREATE TABLE User 
(
    `user_pk`   INT NOT NULL AUTO_INCREMENT,
    `user_id`   VARCHAR(30) NOT NULL,
    `password`  VARCHAR(200) NOT NULL,
    `name`      VARCHAR(20) NOT NULL,
    `gender`    VARCHAR(20),
    `nickname`  VARCHAR(20),
    `home_id`   INT NOT NULL,
    PRIMARY key (`user_pk`),
    
);

CREATE TABLE Home
(
    `home_id`   INT NOT NULL,
    `name`      VARCHAR(50) UNIQUE,
    `rent_date` INT,
    `rent_month` INT,
    PRIMARY key (`home_id`),
    FOREIGN KEY (`home_id`) REFERENCES `User` (`home_id`)
)