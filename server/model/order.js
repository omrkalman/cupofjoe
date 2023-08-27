const knex = require('../config/knex');
const debug = require('debug')('cupofjoe:model/order');

const findOrderByIduser = async(iduser) => {
    return knex('order')
        .where({ iduser });
}

/**
 * find orders using criteria of your choosing
 * the object contains key-value pair to be matched with column in table
 * @param {object} obj 
 * @returns promise
 */
const findOrdersBy = async(obj) => {
    return knex('order')
        .where(obj);
}


/**
 * @param {number, object} iduser, order Structure of order:
 *      order: [ {}, {}, {}, ... ] 
 *          each object is { idproduct: xxx, qty: xxx, ?recurring: x }
 * @returns promise
 */
const addOrder = async(iduser, order) => {
    
    // Using a transaction because it is a multi-step operation
    return knex.transaction(async(trx) => {
        
        const ids = await trx('order')
            .insert({ iduser });

        order.forEach((line) => line.idorder = ids[0]);

        await trx('orderline')
            .insert(order); 
    });
}


const getLines = (idorder) => {
    return knex('orderline')
        .where({ idorder });
}


module.exports = {
    findOrderByIduser,
    findOrdersBy,
    addOrder,
    getLines
}