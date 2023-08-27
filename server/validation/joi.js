const Joi = require('joi');
const validate = require('./validate');
const debug = require('debug')('cupofjoe:joi');

const schemaMap = new Map();

const pw = Joi.string().min(8).max(16)
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{1,}$/))
    .messages({
        'string.empty': "Can't be empty",
        'string.min': 'Has to be at least 8 characters long',
        'string.max': "Can't be longer than 16 characters.",
        'string.pattern.base': 'Needs to have at least 1 of each: lowercase, uppercase, number, and special character'
    });

schemaMap.set('register',
    new Joi.object({
        email: Joi.string().required().email().trim().max(50),
        pw: pw.required(),
        phone: Joi.string().required().trim().pattern(new RegExp('^05\\d{8}$')),
        fn: Joi.string().required().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$')),
        ln: Joi.string().required().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$')),
        city: Joi.string().required().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$')),
        address: Joi.string().required().trim().min(1).max(100)
    })
);

schemaMap.set('login',
    new Joi.object({
        email: Joi.string().required().email().trim().max(50),
        pw: Joi.string().required().trim().min(8).max(16)
    })
);

schemaMap.set('unlock',
    Joi.object({
        iduser: Joi.number().integer().min(1),
        email: Joi.string().email().trim().max(50),
        phone: Joi.string().trim().pattern(new RegExp('^05\\d{8}$'))
    }).length(1)
);

schemaMap.set('get products',
    Joi.object({
        name: Joi.string().allow('').max(50),
        category: Joi.string().valid('', 'other','beans', 'capsules', 'machines', 'accessories'),
        min: Joi.number().allow('').min(0),
        max: Joi.number().allow('').min(0),
        sort: Joi.string().valid('', 'asc', 'desc'),
        hide: Joi.number().valid('', 0, 1),
        page: Joi.number().allow('').integer().min(1),
        amount: Joi.number().allow('').integer().min(1)
    })
);

schemaMap.set('find product',
    Joi.object({
        idproduct: Joi.number().required().integer().min(1)
    })
)

schemaMap.set('order', 
    Joi.array().items(
        Joi.object({
            idproduct: Joi.number().required().integer().min(1),
            qty: Joi.number().required().integer().min(1),
            recurring: Joi.string().valid('d','w','m')
        })
    ).min(1).unique('idproduct')
);

schemaMap.set('fav',
    new Joi.object({
        idproduct: Joi.number().required().integer().min(1)
    })
);

schemaMap.set('add product',
    Joi.object({
        name: Joi.string().required().trim().min(1).max(30),
        price: Joi.number().required().min(0).max(999999.99),
        category: Joi.string().required().valid('other','beans', 'capsules', 'machines', 'accessories'),
        stock: Joi.number().required().integer().min(0),
        desc: Joi.string().trim().max(200),
        hide: Joi.number().valid(0,1)
    })
);

schemaMap.set('edit product',
    Joi.object({
        idproduct: Joi.number().required().integer().min(1),
        values: Joi.object({  
            name: Joi.string().trim().min(1).max(30),
            price: Joi.number().min(0).max(999999.99),
            category: Joi.string().valid('other','beans', 'capsules', 'machines', 'accessories'),
            stock: Joi.number().integer().min(0),
            desc: Joi.string().trim().max(200).allow(''),
            hide: Joi.number().valid(0,1)
        })
    })      
);

schemaMap.set('delete product',
    Joi.object({
        idproduct: Joi.number().required().integer().min(1)
    })
);

schemaMap.set('restock',
    Joi.array().items(
        Joi.object({
            idproduct: Joi.number().required().integer().min(1),
            qty: Joi.number().required().integer().min(1),
        })
    ).min(1)
);

schemaMap.set('reset pw',
    Joi.object({
        pw: pw.required()
    })
);

schemaMap.set('edit user detail',
    Joi.object({
        email: Joi.string().email().trim().max(50),
        pw,
        phone: Joi .string().trim().pattern(new RegExp('^05\\d{8}$')),
        fn: Joi.string().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$')),
        ln: Joi.string().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$')),
        city: Joi.string().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$')),
        address: Joi.string().trim().min(1).max(100)
    }).length(1)
);

schemaMap.set('get reviews',
    Joi.object({
        amount: Joi.number().allow('').integer().min(1).max(10),
        batch: Joi.number().allow('').integer().min(1),
        idreview: Joi.number().allow('').integer().min(1),
        iduser: Joi.number().allow('').integer().min(1),
        idproduct: Joi.number().allow('').integer().min(1),
        idparent: Joi.number().allow('').integer().min(1)
    })
);

schemaMap.set('add review',
    Joi.object({
        idproduct: Joi.number().required().integer().min(1),
        rating: Joi.number().required().integer().min(1).max(5),
        content: Joi.string().min(2).max(200),
        idparent: Joi.number().integer().min(1)
    })
);

schemaMap.set('get lines',
    Joi.object({
        idorder: Joi.number().required().integer().min(1)
    })
);

module.exports = (input, schema) => {
    return validate(input, schemaMap.get(schema));
}