const express = require('express');
const router = express.Router();
const model = require('../../model/order');
const productModel = require('../../model/product');
const validator = require('../../validation/joi');
const debug = require('debug')('cupofjoe:api/product');
const mw = require('../../middleware/mw');
const StdResponse = require('../../utility/StdResponse');

/**
 * For a user to view his orders.
 * Protected by middleware
 */
router.get('/', mw.isUser, async(req, res) => {
    debug('\nGET ORDERS');
    try {
        // req.iduser is assigned from middleware (extracted from token)
        const orders = await model.findOrderByIduser(req.iduser);
        
        if (!orders[0]) {
            throw new StdResponse(
                'error',
                'model',
                { msg: ['No orders were found.'] }
            )
        }
        
        res.json(new StdResponse(
            'success',
            'model',
            { orders }
        ));

    } catch(error) {
        debug(error);
        switch (error.origin) {
            case 'model':
                res.status(404).json(error);
                break;
            default:
                res.status(500).json();
        }
    }
});


/**
 * For a user to make an order.
 * Data in req.body
 * Protected by middleware.
 * order structure: [ {}, {}, {}, ... }] each obj is a line in order
 * line structure: { idproduct: xxx, qty: xxx }
 * Each idproduct must not appear more than once
 */
router.post('/', mw.isUser, async(req, res) => {
    debug('\nNEW ORDER');
    try{

        const order = await validator(req.body, "order");
        debug(order); // array
        
        // Subtracting off from stock the products that are being bought
        await productModel.restockProducts(order, 'subtraction');
        // No error so far, 
        // means all products exist and are in stock. 
        // Progressing:
        
        await model.addOrder(req.iduser, order);

        res.json(new StdResponse(
            'success',
            'model',
            { msg: ['Your order was placed.'] }
        ));
    
    } catch(error) {

        if (error.errno == 1690) {
            const idproduct = error.sql[error.sql.length-1];
            error = new StdResponse('error', 'inventory', { 
                msg: [
                    `There is not enough in stock of product ${idproduct}.`,
                    'None of the re-stocks were commited.' 
                    ],
                idproduct
            });
        } else if (error.idproduct) {
            error = new StdResponse('error', 'model', { 
                msg: [
                    `idproduct ${error.idproduct} was not found.`,
                    'None of the re-stocks were commited.' 
                    ],
                idproduct: error.idproduct
            });
        }

        debug(error);
        switch (error.origin) {
            case 'validation':
                res.status(400).json(error);
                break;
            case 'model':
                res.status(404).json(error);
                break;
            case 'inventory':
                res.status(503).json(error);
                break;
            default:
                res.status(500).json();
        }        
    } 
});


router.get('/:idorder', mw.isUser, async(req, res) => {
    try {
        const { idorder } = await validator(req.params, 'get lines');
        const { iduser } = req;
        
        // Looking for requested order match with requesting user
        const match = await model.findOrdersBy({ idorder, iduser });
        if (!match[0]) {
            throw new StdResponse(
                'error',
                'model',
                { 
                    msg: [`No order was found.`],
                    idorder
                }
            )
        }

        // Looking for lines with the idorder
        const lines = await model.getLines(idorder);
        if (!lines[0]) {
            throw new StdResponse(
                'error',
                'model',
                { 
                    msg: [`No lines were found.`],
                    idorder
                }
            )
        }

        res.json(new StdResponse(
            'success',
            'model',
            { lines }
        ));
    } catch(error) {
        debug(error);
        switch (error.origin) {
            case 'validation':
                res.status(400).json(error);
                break;
            case 'model':
                res.status(404).json(error);
                break;
            default:
                res.status(500).json();
        }
    }
});


module.exports = router;