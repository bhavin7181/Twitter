CREATE TABLE `twitter`.`followers_following` (follower varchar(500),following_to varchar(500),created_dt date,primary key(follower,following_to));

CREATE TABLE TWIT(twit_id numeric, user_name varchar(500),twit varchar(140),created_dt date);

CREATE TABLE RE_TWIT(twit_id numeric,comment varchar(140),retweet_user varchar(500),created_dt date);

ALTER TABLE USERs add column twitter_handle varchar(500); 

ALTER TABLE USERs add column location varchar(150); 

ALTER TABLE TWEET MODIFY created_dt datetime;
ALTER TABLE TWEET modify twit_id
AUTO_INCREMENT=1;

TRUNCATE TABLE TWEET;


 ALTER TABLE TWEET AUTO_INCREMENT=1;

	select concat('Born on ',MONTHNAME(birth_date),' ',EXTRACT(day from birth_date),',',YEAR(birth_date)) AS 'birth_date', location, YEAR(created_dt) AS 'year', MONTHNAME(created_dt) AS 'month' FROM users WHERE user_name='bhavin'; 

SELECT * from USERs ;

INSERT into tweet values ('bhavin','dd',NOW());
