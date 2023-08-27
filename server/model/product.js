const knex = require('../config/knex');
const debug = require('debug')('cupofjoe:model/product');
const StdResponse = require('../utility/StdResponse');

/**
 * Building a query string according to values, 
 * then executing it.
 * @param {object} values Query values
 */
const getProducts = (values) => {
    // Destructuring
    let { name, category, min, max, sort, hide, page, amount } = values;
    
    // Setting up the query
    let query = knex('product');
    
    // Dynamically building the query
    // Starting with WHERE clause
    query = query.where((builder) => {
        if (name) builder.where('name', 'like', `%${name}%`); 
        if (category) builder.where({ category });
        if (min) builder.where('price', '>=', min);
        if (max) builder.where('price', '<=', max);
        if (hide) builder.where('hide', '1');
    });

    // Dynamically building ORDER BY and LIMIT and OFFSET
    if (sort) query = query.orderBy('price', sort);
    query = query.limit(amount);
    query = page ? query.offset((page-1)*amount) : query.offset(0);
    
    // Returning a promise
    return query;    
}

/**
 * number is supplied, looks in table for product with that id
 * @param {number} idproduct What to find the products by
 * @returns Promise
 */
const findProductById = async(idproduct) => {
    return knex('product')
        .where({ idproduct });
}


/**
 * find products using criteria of your choosing
 * the object contains key-value pair to be matched with column in table
 * @param {object} obj 
 * @returns promise
 */
const findProductsBy = async(obj) => {
    return knex('product')
        .where(obj);
}


/**
 * @param {object} values The details of the product
 * @returns Promise
 */
const addProduct = async(values) => {
    return knex('product')
        .insert(values);
}

/**
 * 
 * @param {string} idproduct 
 * @param {object} values 
 * @returns Promise
 */
const editProduct = async(idproduct, values) => {
    // Setting up the query
    let query = knex('product');
    
    // Dynamically building the UPDATE clause
    // According to the values in values
    for (const column in values) {
        query = query.update(column, values[column]);
    }
    
    // WHERE
    query = query.where({ idproduct });
    
    // Returning a promise
    return query;    
}



/**
 * @param {object} obj Key and value to match
 * @returns Promise
 */
const deleteProduct = async(obj) => {
    return knex('product')
        .where(obj)
        .del();
}

/**
 * Add to stock of multiple products, each with
 * specified quantity.
 * @param {array} list Array of objects that 
 * contain pairs of idproduct and qty to restock.
 * @param {boolean} dec Signals whether to subtract from stock
 * (otherwise adding to stock)
 * @returns Promise
 * @throws error when product does not have enough in stock
 * @throws error when idproduct was not found
 */
const restockProducts = (list, dec) => {
    return knex.transaction(async(trx) => {
        let count = 0;
        for (const pair of list) {  
            const { idproduct, qty } = pair;
            // Implementing based on dec:
            let result = dec ?
                await trx('product')
                    .decrement('stock', qty).where({ idproduct })
            :
                await trx('product')
                    .increment('stock', qty).where({ idproduct });
            
            if (!result) throw { idproduct };
            count++;
        }
        debug(count + ' products were restocked');
        return count; 
    });
}


module.exports = {
    getProducts,
    findProductsBy,
    findProductById,
    addProduct,
    editProduct,
    deleteProduct,
    restockProducts
}