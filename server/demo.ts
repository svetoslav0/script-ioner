// This file is created for test purpose

import mysql from "mysql";


const adapter = "mysql";

import(adapter)
    .then((db) => {
        const database = db.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'scriptioner'
        }).connect(); 

        console.log(database);
    })

