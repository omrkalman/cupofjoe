const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const model = require('../../model/product');
const validator = require('../../validation/joi');
const debug = require('debug')('cupofjoe:api/product');
const mw = require('../../middleware/mw');
const StdResponse = require('../../utility/StdResponse');


/**
 * To see products.
 * No middleware - everyone has access
 * Details in req query:
 * GET 127.0.0.1:3000/api/product/?name=&category=&min=&max=&sort=&page=&amount=
 */
router.get('/', async(req, res, next) => {
    debug('\nGET PRODUCTS');
    try {
        const values = await validator(req.query, 'get products');
        debug(values);
        
        req.values = values;
        
        if (values.hide) mw.isAdmin(req, res, next);
        else next();

    } catch (error) {
        
        req.error = error;
        next();

    }
}, async(req, res) => {
    try {
        if (req.error) throw req.error;

        //giving default amount
        req.values.amount ||= 10;

        let products = await model.getProducts(req.values);
        
        // calculating the difference between expected amount and actual amount, for UI purposes
        const discrepancy = req.values.amount - products.length;

        if (!req.values.hide) products = products.filter(p => !p.hide);

        if (!products[0]) {
            throw new StdResponse(
                'error',
                'model',
                { msg: ['No products were found.'] }
            );
        }

        res.json(new StdResponse(
            'success',
            'model',
            { products, discrepancy }
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


// router.get('/hidden', async(req, res) => {
//     res.json({ body: { products: [{name: 'chingus'},{name: 'chico'},{name: 'chechnia'}] }})
// })


router.get('/:idproduct', async(req, res) => {
    try {
        const id = await validator(req.params, 'find product');

        const product = (await model.findProductsBy(id))[0];

        if (!product || product.hide) {
            throw new StdResponse(
                'error',
                'model',
                { msg: [`Product ${id.idproduct} was not found.`] }
            )
        }

        res.json(new StdResponse(
            'success',
            'model',
            { product }
        ));

    } catch(error) {
        switch(error.origin) {
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


/**
 * For admins to add new products for sale
 * Details in body.
 */
router.post('/', mw.isAdmin, async(req, res) => {
    debug('\nADD PRODUCT');
    try {
        const values = await validator(req.body, 'add product');
        
        await model.addProduct(values);
       
        res.json(new StdResponse(
            'success',
            'model',
            { msg: ['Product was added.'] }
        ));
    } catch(error) {
        switch(error.origin) {
            case 'validation':
                res.status(400).json(error);
                break;
            default:
                res.status(500).json();
        }
    }
});

router.post('/image', upload.single('product_image'), async(req, res) => {
    try {
        console.log('req.file', req.file);
        
        if (!req.file?.filename) throw new StdResponse(
            'error',
            'multer',
            { msg: ["Couldn't upload"] }
        )

        res.json(new StdResponse(
            "success",
            "multer",
            { 
                msg: ['File uploaded successfully'],
                fileName: req.file?.filename 
            }
        ));
    } catch(error) {
        switch(error.origin) {
            case 'multer':
                res.status(500).json(error);
                break;
            default:
                res.status(500).json();
        }
    }
    
});

/**
 * For admins to edit products for sale
 * Details in req.body, structure:
 *  { 
 *      idproduct: xxx 
 *      values: { 
 *          key:value, 
 *          key:value, 
 *          ...
 *      }
 *  }
 */
router.patch('/', mw.isAdmin, async(req, res) => {
    debug('\nEDIT PRODUCT');
    try {
        const { idproduct, values } = await validator(req.body, 'edit product');

        if (values.desc === '') values.desc = null;
        
        // resolves to 0 if product wasn't found
        if (!await model.editProduct(idproduct, values)) {
            throw new StdResponse(
                'error',
                'model',
                { msg: [`Product ${idproduct} was not found.`] }
            );
        }

        res.json(new StdResponse(
            'success',
            'model',
            { msg: ['Product was updated.'] }
        ));
    } catch(error) {
        switch(error.origin) {
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


/**
 * For admins to delete products for sale
 * Details in body.
 */
router.delete('/:idproduct', mw.isAdmin, async(req, res) => {
    debug('\nDELETE PRODUCT');
    try {
        const product = await validator(req.params, 'delete product');
        
        // Resolves to 0 if product wasn't found
        if (!await model.deleteProduct(product)) {
            throw new StdResponse(
                'error',
                'model',
                { msg: [`Product ${product.idproduct} was not found.`] }
            );
        }

        res.json(new StdResponse(
            'success',
            'model',
            { msg: [`Product ${product.idproduct} was deleted.`] }
        ));
    } catch(error) {
        switch(error.origin) {
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


router.patch('/restock', mw.isAdmin, async(req, res) => {
    debug('RESTOCK');
    try {
        const list = await validator(req.body, 'restock');
 
        const result = await model.restockProducts(list);
        
        res.json(new StdResponse(
            'success',
            'model',
            { msg: [`${result} products were restocked`] }
        ));

    } catch(error) {

        if (error.idproduct) {
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
            default:
                res.status(500).json();
        }
    }
});

module.exports = router;