const knex = require('../config/knex');

const getFavsByIduser = async(iduser) => {
    return knex('favorite')
        .where({ iduser });
}


const addFav = async(fav) => {
    return knex('favorite')
        .insert(fav);
}


const removeFav = async(obj) => {
    return knex('favorite')
        .where(obj)
        .del();
}

module.exports = {
    getFavsByIduser,
    addFav,
    removeFav
}