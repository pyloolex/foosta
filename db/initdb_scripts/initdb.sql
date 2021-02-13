create role foostauser login superuser password 'foostapassword';
create database foostadb;
\c foostadb foostauser;


create table users (
    username varchar(20),
    salary int,
    married boolean
);
insert into users (username, salary, married) values
  ('fa', 2, True),
  ('be', 189, False);



create table "MatchMeta" (
    date DATE not null,
    match_number INT not null,
    red_score INT not null,
    blue_score INT not null
);
create table "MatchSquads" (
    date DATE not null,
    match_number int not null,
    player varchar(100),
    team varchar(100)
);

insert into "MatchMeta" (date, match_number, red_score, blue_score) values
    ('2005-06-23', 0, 18, 4),
    ('2005-07-10', 0, 15, 15);

insert into "MatchSquads" (date, match_number, player, team) values
    ('2005-06-23', 0, 'Cristiano', 'red'),
    ('2005-06-23', 0, 'Messi', 'red'),
    ('2005-06-23', 0, 'T. Henry', 'red'),
    ('2005-06-23', 0, 'Petya', 'blue'),
    ('2005-06-23', 0, 'Vasya', 'blue'),

    ('2005-07-10', 0, 'Messi', 'red'),
    ('2005-07-10', 0, 'Vasya', 'red'),
    ('2005-07-10', 0, 'Cristiano', 'blue'),
    ('2005-07-10', 0, 'Petya', 'blue');
