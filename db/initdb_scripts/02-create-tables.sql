\c foostadb foostauser;


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
