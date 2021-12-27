# Installation

## [WIP]
Create password files.
```bash
    # DB
    echo '"db-pass"' > db/shared/password_db.json
    cp db/shared/password_db.json backend/flask_app/foosta/password_db.json

    # Backend
    echo '"back-pass"' > backend/flask_app/foosta/password_backend.json
```



## Set up database
[/docs/install/db.md](/docs/install/db.md)

## Set up flask backend
[/docs/install/backend.md](/docs/install/backend.md)

## Set up UI
[/docs/install/ui.md](/docs/install/ui.md)
