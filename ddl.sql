
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
    `name`      VARCHAR(50) NOT NULL,
    PRIMARY key (`user_pk`) 
);