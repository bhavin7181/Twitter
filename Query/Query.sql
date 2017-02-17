select * from twit;

Insert into twit values(1,'bhavin');

select * from users;

alter table twit add primary key (twit_id) references users(user_name);

select * from re_tweet;

select * from followers_following;
rename table twit to TWEET;
select count(1) from twit where user_name='bhavin';
select count(follower) from followers_following where following_to='bhavin';
select count(following_to) from followers_following where follower='bhavin';
select twit,created_dt from tweet t where t.user_name='bhavin' order by created_dt desc;
select t.twit,t.created_dt from re_tweet r,tweet t where r.retweet_user='bhavin' and t.twit_id=r.twit_id;
select t.twit,t.created_dt from re_tweet r,tweet t where r.retweet_user in (select follower from followers_following where following_to='bhavin') and t.twit_id=r.twit_id order by r.created_dt desc;
select * from followers_following;
select t.twit,t.created_dt from re_tweet r,tweet t where t.retweet_user in (select follower from followers_following where following_to='bhavin') and t.twit_id=r.twit_id order by r.created_dt desc;

select t.twit,t.created_dt from tweet t where t.user_name in (select follower from followers_following where following_to='bhavin') order by t.created_dt desc;


CREATE PRIMARY KEY ddd ;

select twit,created_dt from tweet t,re where t.user_name='bhavin' order by created_dt desc;