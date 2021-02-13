\c foostadb foostauser;

create table MatchMeta (
    date DATE not null,
    matchNumber INT not null,
    redScore INT not null,
    blueScore INT not null
);

create table MatchSquads (
    date DATE not null,
    matchNumber int not null,
    player varchar(100),
    team varchar(100)
);
