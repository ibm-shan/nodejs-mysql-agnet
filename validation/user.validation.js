const Joi = require('joi');

/****************************************************************************************************
 *  Validation : 사용자 등록 
 * --------------------------------------------------------------------------------------------------
 *  Description : 
 *      define a register validation module
 ****************************************************************************************************/
const registerValidation = (data) => {

    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data,schema);

};

/****************************************************************************************************
 *  Validation : 사용자 변경
 * --------------------------------------------------------------------------------------------------
 *  Description : 
 *      define a user update validation module
 ****************************************************************************************************/
const userUpdateValidation = (data) => {

    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email()
    };
    return Joi.validate(data,schema);

};


/****************************************************************************************************
 *  Validation : 로그인
 * --------------------------------------------------------------------------------------------------
 *  Description : 
 *      define a login validation module
 ****************************************************************************************************/
const loginValidation = data => {

    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    };
    return Joi.validate(data,schema);

};
 
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.userUpdateValidation = userUpdateValidation;
