import Joi from 'joi';
import { EditableProductField, EditableUserField } from '../types/types';

const schemaMap = new Map<string, Joi.Schema>();

const messages = {
    'string.alphanum': '{{#label}} must only contain alpha-numeric characters',
    'string.base': '{{#label}} must be a string',
    'string.base64': '{{#label}} must be a valid base64 string',
    'string.creditCard': '{{#label}} must be a credit card',
    'string.dataUri': '{{#label}} must be a valid dataUri string',
    'string.domain': '{{#label}} must contain a valid domain name',
    'string.email': '{{#label}} must be a valid email',
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.guid': '{{#label}} must be a valid GUID',
    'string.hex': '{{#label}} must only contain hexadecimal characters',
    'string.hexAlign': '{{#label}} hex decoded representation must be byte aligned',
    'string.hostname': '{{#label}} must be a valid hostname',
    'string.ip': '{{#label}} must be a valid ip address with a {{#cidr}} CIDR',
    'string.ipVersion': '{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR',
    'string.isoDate': '{{#label}} must be in iso format',
    'string.isoDuration': '{{#label}} must be a valid ISO 8601 duration',
    'string.length': '{{#label}} length must be {{#limit}} characters long',
    'string.lowercase': '{{#label}} must only contain lowercase characters',
    'string.max': '{{#label}} length must be less than or equal to {{#limit}} characters long',
    'string.min': '{{#label}} length must be at least {{#limit}} characters long',
    'string.normalize': '{{#label}} must be unicode normalized in the {{#form}} form',
    'string.token': '{{#label}} must only contain alpha-numeric and underscore characters',
    'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
    'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern',
    'string.pattern.invert.base': '{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}',
    'string.pattern.invert.name': '{{#label}} with value {:[.]} matches the inverted {{#name}} pattern',
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
    'string.uri': '{{#label}} must be a valid uri',
    'string.uriCustomScheme': '{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern',
    'string.uriRelativeOnly': '{{#label}} must be a valid relative uri',
    'string.uppercase': '{{#label}} must only contain uppercase characters'
}


schemaMap.set('id', Joi.number().required().integer().min(1)
    .messages(messages)    
);
schemaMap.set('idproduct', schemaMap.get('id') as Joi.Schema<any>);
schemaMap.set('iduser', schemaMap.get('id') as Joi.Schema<any>);


schemaMap.set('email', Joi.string().required().email({ tlds: { allow: false } }).max(30)
    .messages({
        'string.empty':"can't be empty",
        'string.max':"can't be longer than 30 characters.",
        'string.email':'needs to be a valid address: name@example.web'
    })
);
schemaMap.set('pw', Joi.string().required().min(8).max(16)
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|])[A-Za-z\d-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]{1,}$/))
    .messages({
        'string.empty':"Can't be empty",
        'string.min':'Has to be at least 8 characters long',
        'string.max':"Can't be longer than 16 characters.",
        'string.pattern.base':'Needs to have at least 1 of each: lowercase, uppercase, number, and special character'
    })
);
schemaMap.set('phone', Joi.string().required().trim().pattern(new RegExp('^05\\d{8}$'))
    .messages({
        'string.empty':"Can't be empty",
        'string.pattern.base':'10 digits needed. Follow this format 05########'
    })    
);
schemaMap.set('fn', Joi.string().required().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$'))
    .messages({
        'string.empty':"Can't be empty",
        'string.max':"Can't be longer than 30 characters.",
        'string.pattern.base':'Use letters from the ABC only'
    })    
);

schemaMap.set('ln', Joi.string().required().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$'))
    .messages({
        'string.empty':"Can't be empty",
        'string.max':"Can't be longer than 30 characters.",
        'string.pattern.base':'Use letters from the ABC only'
    })    
);
schemaMap.set('city', Joi.string().required().trim().min(1).max(30).pattern(new RegExp('^[A-Za-z ]+$'))
    .messages({
        'string.empty':"Can't be empty",
        'string.max':"Can't be longer than 30 characters.",
        'string.pattern.base':'Use letters from the ABC only'
    })    
);
schemaMap.set('address', Joi.string().required().trim().min(1).max(100)
    .messages({
        'string.empty':"Can't be empty",
        'string.max':"Can't be longer than 100 characters.",
    })    
);


schemaMap.set('login',
    Joi.object({
        email: schemaMap.get('email'),
        pw: schemaMap.get('pw')
    })
);


schemaMap.set('name', Joi.string().trim().min(1).max(30).label('name')
    .messages(messages)    
);
schemaMap.set('price', Joi.number().min(0).max(999_999.99)
    .messages(messages)    
);
schemaMap.set('category', Joi.string().valid('other','beans', 'capsules', 'machines', 'accessories')
    .messages(messages)    
);
schemaMap.set('stock', Joi.number().integer().min(0).label('stock')
    .messages(messages)    
);
schemaMap.set('desc', Joi.string().trim().max(200).allow('')
    .messages(messages)    
);
schemaMap.set('hide', Joi.number().valid(0,1)
    .messages(messages)
);

const validate = (schema: EditableUserField | EditableProductField | 'login', input: any) => schemaMap.get(schema)!.validate(input, {abortEarly: false});
export default validate;