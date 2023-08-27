const knex = require('../config/knex');

/**
 * @param {string} email 
 * @returns Promise
 */
const findUserByEmail = async(email) => {
    return knex('user')
        .where({ email });
}

/**
 * find users using criteria of your choosing
 * the object contains key-value pair to be matched with column in table
 * @param {object} obj 
 * @returns promise
 */
const findUserBy = async(obj) => {
    return knex('user')
        .where(obj);
}


const addNewUser = async(user) => {
    // Returning a promise
    return knex('user')
        .insert(user);
}


const addFailedLogin = async(iduser) => {
    // Returning a promise
    return knex('user')
        .where({ iduser })
        .increment('failedLogins', 1)
}


const unlockUser = async(obj) => {
    //Returning a promise
    return knex('user')
        .where(obj)
        .update('failedLogins', 0);
}


const isAdmin = async(iduser) => {
    // Returning a promise
    return knex('user')
        .where({ iduser })
        .select('isAdmin');
}

const setById = async(iduser, obj) => {
    return knex('user')
        .where({ iduser })
        .update(obj);
}

module.exports = {
    findUserByEmail,
    findUserBy,
    addNewUser,
    addFailedLogin,
    unlockUser,
    isAdmin,
    setById
}