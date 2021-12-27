DO
$do$
DECLARE
    _pass json := pg_read_file('/tmp/foosta_shared/password.json', 0, 1000);
BEGIN
    /* This `#>> '{}'` somehow converts json into string. */
    EXECUTE format(
        'CREATE ROLE foostauser LOGIN SUPERUSER PASSWORD %L',
        _pass #>> '{}');
    /* Logging:
    RAISE NOTICE 'Created user with password %', _pass #>> '{}';
    */
END
$do$;


create database foostadb;


/* Without secure password storage, it would be simply:
create role foostauser login superuser password 'foostapassword';
create database foostadb;
*/
