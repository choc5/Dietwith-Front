CREATE DATABASE testdb;

use testdb;


CREATE TABLE Users (
    user_id VARCHAR(20) NOT NULL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_gender ENUM('M', 'F') NOT NULL,
    user_height DECIMAL(5,2),
    user_purpose VARCHAR(50),
    user_like JSON,
    user_hate JSON,
    user_activity ENUM('얌전', '보통', '활발') NOT NULL
);


CREATE TABLE User_sign (
    id VARCHAR(20) NOT NULL PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL ,
    pw VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
) ;


CREATE TABLE User_weight (
    record_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    record_date DATE NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Follows (
    follower_id VARCHAR(20) NOT NULL,
    followee_id VARCHAR(20) NOT NULL,
    followed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followee_id),
    FOREIGN KEY (follower_id) REFERENCES Users(user_id),
    FOREIGN KEY (followee_id) REFERENCES Users(user_id)
);

CREATE TABLE Feeds (
    feed_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    feed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    category ENUM('아침', '점심', '저녁', '간식') NOT NULL,
    content TEXT,
    img_src VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Feed_menu (
    menu_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    feed_id INT NOT NULL,
    menu_name VARCHAR(20) NOT NULL,
    menu_calorie INT,
    FOREIGN KEY (feed_id) REFERENCES feeds(feed_id)
);

CREATE TABLE Feed_comments (
    comments_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    feed_id INT NOT NULL,
    user_id VARCHAR(20) NOT NULL,
    comments_text TEXT NOT NULL,
    comment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (feed_id) REFERENCES feeds(feed_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Daily_calories (
    calorie_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    total_calories INT NOT NULL,
    record_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

/*
use mysql;
select host ,user from user;
select * from user_sign;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
FLUSH PRIVILEGES;
*/
INSERT INTO Users (user_id, user_name, user_gender, user_height, user_purpose, user_like, user_hate, user_activity) VALUES
('a1', 'a1', 'M', NULL, NULL, '[]', '[]','보통'),
('a2', 'a2', 'F', NULL, NULL, '[]', '[]', '보통');

INSERT INTO user_sign (id, user_id, pw, email, type) VALUES
('a', 'a1', 'a', 'a1@naver.com', '다이어트'),
('a2', 'a2', 'a', 'a2@naver.com', '다이어트');

select * from users;
select * from user_sign;
SELECT * FROM User_sign WHERE id = 'a2' AND pw = 'a';


