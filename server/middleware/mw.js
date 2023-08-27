const jwt = require('../config/jwt');
const debug = require('debug')('cupofjoe:mw');
const StdResponse = require('../utility/StdResponse');
// const authModel = require('../model/auth');


/**
 * Verifies the token from req is authentic
 */
const isUser = async(req, res, next) => {
    try {
        const payload = await jwt.verifyToken(req.headers?.token);
        debug(payload);
        
        // Pass data onward to chain
        if (!payload.iduser) throw { message: 'invalid signature'};
        req.iduser = payload.iduser;
        
        // Run the next part of the chain
        next();

    } catch(error) {
        // Fake, expired or no token

        const myError = new StdResponse(
            'error',
            'middleware',
            { msg: [error.message.replace('jwt','token')] }
        );
        debug(myError);

        // Determining the right status code        
        switch(error.message) {
            case 'jwt must be provided':
            case 'jwt expired':
                res.status(401).json(myError);
                break;
            case 'invalid signature':
                res.status(400).json(myError);
                break;
            default:
                res.status(500).json();
        }
    }
}

/**
 * Verifies the token from req is authentic and belongs to an admin
 */
const isAdmin = async(req, res, next) => {
    try {
        const payload = await jwt.verifyToken(req.headers?.token);
        debug(payload);
        
        // Check if token belongs to an admin
        // const modelResponse = (await authModel.isAdmin(payload.iduser))[0].isAdmin;
        // debug('isAdmin:',modelResponse);
        if (!payload.iduser) throw { message: 'invalid signature'};
        if (!payload.isAdmin) throw { message: 'Privileges required.' };
        

        // Pass data onward to chain
        req.iduser = payload.iduser;
        
        // Run the next part of the chain
        next();

    } catch(error) {
        // Fake or no token, or not admin
        const myError = new StdResponse(
            'error',
            'middleware',
            { msg: [error.message.replace('jwt','token')] }
        )
        debug(myError);

        // Determining the right status code
        switch(error.message) {
            case 'Privileges required':
                res.status(403).json(myError);
                break;
            case 'jwt must be provided':
            case 'jwt expired':
                res.status(401).json(myError);
                break;
            case 'invalid signature':
                res.status(400).json(myError);
                break;
            default:
                res.status(500).json();
        }
    }
}

module.exports = {
    isUser,
    isAdmin
}
