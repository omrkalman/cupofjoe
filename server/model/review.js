const knex = require('../config/knex');
const debug = require('debug')('cupofjoe:model/order');

const getReviews = async(values) => {
    // Destructuring
    let { amount, batch, idreview, iduser, idproduct, idparent } = values;

    // Setting up the query
    let query = knex('review');
    
    // Dynamically bulding WHERE
    if (idreview) query = query.where({ idreview });
    else if (iduser) query = query.where({ iduser });
    else if (idparent) query = query.where({ idparent });
    else {
        query = query.where((builder) => {
            
            builder.whereNull('idparent');          
            if (idproduct) builder.where({ idproduct });     

        });
    }

    query = query.orderBy('rating', 'desc');
    
    // Dynamically building LIMIT and OFFSET
    query = amount ? query.limit(amount) : query.limit(5);
    query = batch ? query.offset((batch-1)*amount) : query.offset(0);
    
    // Returning a promise
    return query;    
}

const addReview = (review) => {
    return knex('review')
        .insert(review);
}

module.exports = {
    getReviews,
    addReview
}