const express = require('express');
const router = express.Router();
const model = require('../../model/review');
const validator = require('../../validation/joi');
const debug = require('debug')('cupofjoe:api/review');
const StdResponse = require('../../utility/StdResponse');
const mw = require('../../middleware/mw');

/**
 * GET 127.0.0.1:3000/api/review
 * Possible params:
 * idreview
 * idproduct
 * iduser
 * idparent
 * amount - how many comments to fetch
 * batch - which 'round' of comments this is
 */
router.get('/', async(req, res) => {
    debug('GET REVIEWS');
    try {
        const values = await validator(req.query, 'get reviews');

        const reviews = await model.getReviews(values);
        
        if (!reviews[0]) {
            throw new StdResponse(
                'error',
                'model',
                { msg: ['No reviews were found.'] }
            );
        }
        
        res.json(new StdResponse(
            'success',
            'model',
            { reviews }
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

/**
 * POST 127.0.0.1:3000/api/review
 *  req.body structure:
 *  {    
 *      idproduct: required
 *      rating: required
 *      content: optional
 *      idparent: optional
 *  }
 */
router.post('/', mw.isUser, async(req, res) => {
    debug('ADD REVIEW');
    try {

        const review = await validator(req.body, 'add review');

        await model.addReview({...review, iduser: req.iduser});

        res.json(new StdResponse(
            'success',
            'model',
            { msg: ['Review added.'] }
        ));

    } catch(error) {
        
        if (error.errno == 1452) {
            error = new StdResponse(
                'error',
                'model',
                { msg: [`Review made a reference to a user, product, or parent which doesn't exist.`] }
            )
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