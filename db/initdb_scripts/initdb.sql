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
