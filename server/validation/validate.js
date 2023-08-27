const StdResponse = require('../utility/StdResponse');


module.exports = (input, schema) => {
    const promise = new Promise((res,rej)=>{
        schema.validateAsync(input, { abortEarly:false })
        .then(valid => res(valid))
        .catch(error => {
            let msg = Array.from(error.details, (item) => item.message);
            let fields = Array.from(error.details, (item => item.context.key));
            rej(new StdResponse('error', 'validation', { msg, fields }));
        })
    });
    return promise;
}