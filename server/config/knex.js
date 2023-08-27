const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.SQLHOST,
        port: process.env.SQLPORT,
        user: process.env.SQLUSER,
        password: process.env.SQLPW,
        database: process.env.SQLDB,
    },
    pool: { min: 0, max: 7 }
});

module.exports = knex;