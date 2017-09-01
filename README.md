# my-ev-ride-backend
My EV Ride Backend

    mysql -uroot -p
    > create database myevride default charset utf8;
    > grant all on myevride.* to 'myevride'@'localhost' identified by 'myevride';
    > quit
    
    mysql -umyevride -p myevride < db/scripts/create.sql
    mysql -umyevride -p myevride < db/scripts/populate.sql
    
Legt einen User admin/admin an.
