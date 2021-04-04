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



create table "EventMeta" (
    date DATE not null,
    event_number INT not null,
    event_type varchar(100) not null
);

create table "EventResult" (
    date DATE not null,
    event_number INT not null,
    team INT not null,
    result INT not null
);
create table "EventSquad" (
    date DATE not null,
    event_number int not null,
    player varchar(100) not null,
    team INT not null
);

insert into "EventMeta" (date, event_number, event_type) values
    ('2021-01-04', 0, 'match'),
    ('2021-01-08', 0, 'tournament');


insert into "EventResult" (date, event_number, team, result) values
    ('2021-01-04', 0, 0, 25),
    ('2021-01-04', 0, 1, 19),
    ('2021-01-08', 0, 0, 1),
    ('2021-01-08', 0, 1, 2),
    ('2021-01-08', 0, 2, 3);

insert into "EventSquad" (date, event_number, player, team) values
    ('2021-01-04', 0, 'Ignatov', 0),
    ('2021-01-04', 0, 'Ivanov', 0),
    ('2021-01-04', 0, 'Zemlyansky', 0),
    ('2021-01-04', 0, 'Ryzhkov', 0),
    ('2021-01-04', 0, 'Gleb', 0),
    ('2021-01-04', 0, 'Klenov', 1),
    ('2021-01-04', 0, 'Narkaytis', 1),
    ('2021-01-04', 0, 'Ekub', 1),
    ('2021-01-04', 0, 'Farid', 1),
    ('2021-01-04', 0, 'Pavel S', 1),
    ('2021-01-04', 0, 'Viktor', 1),

    ('2021-01-08', 0, 'Ignatov', 0),
    ('2021-01-08', 0, 'Berezovsky', 0),
    ('2021-01-08', 0, 'Maksim A', 0),
    ('2021-01-08', 0, 'Zhanat', 0),
    ('2021-01-08', 0, 'Pasha ot Vasi', 0),
    ('2021-01-08', 0, 'Ivanov', 1),
    ('2021-01-08', 0, 'Egorenko', 1),
    ('2021-01-08', 0, 'Zemlyansky', 1),
    ('2021-01-08', 0, 'Minasyan', 1),
    ('2021-01-08', 0, 'Gleb', 1),
    ('2021-01-08', 0, 'Narkaytis', 2),
    ('2021-01-08', 0, 'Zhenya', 2),
    ('2021-01-08', 0, 'Ekub', 2),
    ('2021-01-08', 0, 'Farid', 2),
    ('2021-01-08', 0, 'Rustam', 2);
