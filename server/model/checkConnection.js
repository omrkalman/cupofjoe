const knex = require('../config/knex');

module.exports = knex.raw('select 1+1 as result');