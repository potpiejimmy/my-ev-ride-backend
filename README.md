# my-ev-ride-backend
My EV Ride Backend

    mysql -uroot -p
    > create database myevride default charset utf8;
    > create user 'myevride'@'localhost' identified with mysql_native_password by 'myevride';
    > grant all on myevride.* to 'myevride'@'localhost';
    > quit
    
    mysql -umyevride -pmyevride < db/scripts/create.sql
    mysql -umyevride -p myevride < db/scripts/populate.sql
    
Legt einen User admin/admin an.
