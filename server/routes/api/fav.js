const express = require('express');
const router = express.Router();
const model = require('../../model/fav');
const validator = require('../../validation/joi');
const debug = require('debug')('cupofjoe:api/fav');
const mw = require('../../middleware/mw');
const StdResponse = require('../../utility/StdResponse');

router.get('/', mw.isUser, async(req, res) => {
    debug('\nGET FAV');
    try {
        const favs = await model.getFavsByIduser(req.iduser);
        if (!favs[0]) {
            throw new StdResponse(
                'error',
                'model',
                { msg: ['No favorites were found.'] }
            );
        }

        res.json(new StdResponse(
            'success',
            'model',
            { favs: favs.map(f => f.idproduct) }
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
 * For a user to add a product to favorites.
 * Details in body.
 * Protected by middleware
 */
router.put('/', mw.isUser, async(req, res) => {
    debug('\nPUT FAV');
    try {
        const obj = await validator(req.body, 'fav');

        obj.iduser = req.iduser;

        await model.addFav(obj);

        res.json(new StdResponse(
            'success',
            'model',
            { msg: ['Added to favorites.'] }
        ));
    } catch(error) {
        if (error.errno == 1062) {
            error = new StdResponse(
                'error',
                'model',
                { msg: ['Product is already in favorites'] }
            );
        }
        switch(error.origin) {
            case 'validation':
                res.status(400).json(error);
                break;
            case 'model':
                res.status(409).json(error);
                break;
            default:
                res.status(500).json();
        }
    }
});


router.delete('/:idproduct', mw.isUser, async(req, res) => {
    try {
        const obj = await validator(req.params, 'fav');
        
        if (!await model.removeFav(obj)) {
            throw new StdResponse(
                'error',
                'model',
                { msg: [`${obj.idproduct} is not a favorite`] }
            );
        }

        res.json(new StdResponse(
            'success',
            'model',
            { msg: [`Product ${obj.idproduct} was removed from favorites.`] }
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

module.exports = router;