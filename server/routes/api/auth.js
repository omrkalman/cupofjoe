const express = require('express');
const router = express.Router();
const model = require('../../model/auth');
const validator = require('../../validation/joi');
const StdResponse = require('../../utility/StdResponse');
const bcrypt = require('../../config/bcrypt');
const jwt = require('../../config/jwt');
const mw = require('../../middleware/mw');
const debug = require('debug')('cupofjoe:api/auth');

router.get('/', mw.isUser, async(req, res) => {
    try {
        const iduser = req.iduser;
        const user = (await model.findUserBy({ iduser }))[0];
        if (user) {
            delete user.pw;
            res.json(new StdResponse(
                'success', 
                'model', 
                { user }
            ));
        } else {
            throw new StdResponse(
                'error',
                'model',
                { msg: [`User ${iduser} was not found.`] }
            );
        }
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
})


// POST 127.0.0.1:3000/api/auth/login
// Details in req body
router.post('/login', async(req, res) => {
    debug('\nLOGIN');
    try {
        const credentials = await validator(req.body, 'login');
        debug(credentials);
        
        // Checking DB if email already exists for another user
        // await in parentheses, to make sure [0] is of the resolved array
        const match = (await model.findUserByEmail(credentials.email))[0];
        debug('Matched user:', match);

        if (!match) {
            throw new StdResponse(
                'error',
                'model',
                { msg: ['Incorrect email or password.'] } 
            );
        }
        // There was a match! Proceeding

        // Checking if user is locked
        if (match.failedLogins > 3) {
            throw new StdResponse(
                'error',
                'model',
                { msg: ['You have exceeded the login attempt limit.'] }
            );
        }

        // Hashing & comparing password to stored hash
        if (!await bcrypt.cmpHash(credentials.pw, match.pw)) {
            // If hashes didn't match

            // Adding 1 to failed login attempt count.
            await model.addFailedLogin(match.iduser);
            
            throw new StdResponse(
                'error',
                'model',
                { msg: ['Incorrect email or password.'] } 
            );
        }
        // Correct credentials! Proceeding

        // Giving out a token
        // Including in token payload info about admin or not
        const { iduser, isAdmin } = match; 
        const token = isAdmin ? 
                await jwt.generateToken({ iduser, isAdmin })
            :
                await jwt.generateToken({ iduser }, '3d');

        // Notifying success
        res.json(new StdResponse(
            'success', 
            'model', 
            {
                msg: ['Logged in successfully.'],
                token
            }
        ));

    } catch(error) {
        debug(error);
        switch (error.origin) {
            case 'validation':
                error.body.msg = ['Improper format.'];
                res.status(400).json(error);
                break;
            case 'model':
                res.status(401).json(error);
                break;
            default:
                res.status(500).json();
        }
    }
});


// POST 127.0.0.1:3000/api/auth/register
// Details in req body
router.post('/register', async(req, res) => {
    debug('\nREGISTRATION');
    try {
        const values = await validator(req.body, 'register');
        debug(values);
        
        // Checking DB if email/phone already exist for another user
        // await in parentheses, to make sure [0] is of the resolved array        
        // const emailMatch = (await model.findUserByEmail(values.email))[0];
        // const phoneMatch = (await model.findUserBy({ phone: values.phone }))[0];
        const emailPromise = model.findUserByEmail(values.email);
        const phonePromise = model.findUserBy({ phone: values.phone });
        const matches =  (await Promise.all([emailPromise, phonePromise])).map(arr => !!arr[0]);
        debug('Matched user(s) ([false,false] is good):', matches);

        if (matches[0] || matches[1]) {
            let fields = [];
            if (matches[0]) fields.push('email');
            if (matches[1]) fields.push('phone');
            throw new StdResponse(
                'error',
                'model', 
                { 
                    fields,
                    msg: fields.map(f => `${f.substring(0,1).toUpperCase() + f.substring(1)} already exists for another account.`) 
                }                
            );
        }
        // The user is indeed new. Proceeding

        // Hashing password
        values.pw = await bcrypt.createHash(values.pw);

        // Awaiting successful insert to DB
        await model.addNewUser(values);

        // Notifying success
        res.json(new StdResponse(
            'success', 
            'model', 
            { msg: ['Registered successfully.'] }
        ));

    } catch(error) {
        debug(error);
        switch (error.origin) {
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


// PATCH 127.0.0.1:3000/api/auth/resetpw
// Details in req body
router.patch('/resetpw', mw.isUser, async(req, res) => {
    debug('RESETPW');
    try {
        const pw = await validator(req.body, 'reset pw');

        pw.pw = await bcrypt.createHash(pw.pw);

        if (!await model.setById(req.iduser, pw)) {
            throw new StdResponse(
                'error',
                'model', 
                { msg: [`User ${req.iduser} wasn't found.`] } 
            );
        }

        // Notifying success
        res.json(new StdResponse(
            'success', 
            'model', 
            { msg: [`Password was changed successfully.`] }
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


// PATCH 127.0.0.1:3000/api/auth/edit
// Details in req body
router.patch('/edit', mw.isUser, async(req, res) => {
    debug('EDIT');
    try {
        const detail = await validator(req.body, 'edit user detail');

        if (detail.pw) {
            detail.pw = await bcrypt.createHash(detail.pw);
        }

        if (detail.email || detail.phone) {
            const match = detail.email ? (await model.findUserByEmail(detail.email))[0] : (await model.findUserBy({ phone: detail.phone }))[0];
            debug('Matched user (undefined is good):', match);
            if (match) {
                throw new StdResponse(
                    'error',
                    'model - already exists', 
                    { msg: [`${(detail.email ? 'Email' : 'Phone')} already exists for another account.`] }                
                );
            }
        }

        if (!await model.setById(req.iduser, detail)) {
            throw new StdResponse(
                'error',
                'model - not found', 
                { msg: [`User ${req.iduser} wasn't found.`] } 
            );
        }

        // Notifying success
        res.json(new StdResponse(
            'success', 
            'model', 
            { msg: [`Change was successful.`] }
        ));

    } catch(error) {
        debug(error);
        switch (error.origin) {
            case 'validation':
                res.status(400).json(error);
                break;
            case 'model - not found':
                res.status(404).json(error);
                break;
            case 'model - already exists':
                res.status(409).json(error);
                break;
            default:
                res.status(500).json();
        }
    }
});


// PATCH 127.0.0.1:3000/api/auth/unlock
// Details in req body
router.patch('/unlock', mw.isAdmin, async(req, res) => {
    debug('\nUNLOCK');
    try {
        const { iduser, email, phone } = await validator(req.body, 'unlock');
        
        let obj = {};

        if (iduser) obj = { iduser };
        if (email) obj = { email }
        if (phone) obj = { phone };
        
        debug(obj);
        
        // Checking if a user with the specified iduser exists
        // Instructing model to unlock the user with the specified iduser
        // Should resolve to a number greater than 0 if it actually updated
        if (!await model.unlockUser(obj)) {
            throw new StdResponse(
                'error',
                'model', 
                { msg: [`User with ${Object.entries(obj)[0].join(': ')} wasn't found.`] } 
            );
        }      

        // Notifying success
        res.json(new StdResponse(
            'success', 
            'model', 
            { msg: [`User with ${Object.entries(obj)[0].join(': ')} was unlocked successfully.`] }
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