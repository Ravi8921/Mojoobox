const mongoose = require('mongoose')
const moment = require('moment')

const {systemConfig} = require('../configs')

const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const reNumber = /\d+/

const validateEmail = function(email) {
    return re.test(email)
};

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    if(typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

const isValidTitle = function(title) {
    return systemConfig.titleEnumArray.indexOf(title) !== -1
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidString = function(value) {
    return Object.prototype.toString.call(value) === "[object String]"
}

const isArray = function(arr) {
    return Array.isArray(arr)
}

const isValidNumber = function(value) {
    return !isNaN(Number(value)) && reNumber.test(value)
}

const isValidLength = function(value, min, max) {
    const len = String(value).length
    return len >= min && len <= max
}

const isInValidRange = function(value, min, max) {
    if(!isValidNumber(value)) return false
    return value >= min && value <= max
}



module.exports = {
    validateEmail,
    emailRegex: re,
    isValid,
    isValidTitle,
    isValidRequestBody,
    isValidObjectId,
    isValidString,
    isArray,
    isValidNumber,
    isValidLength,
    isInValidRange,
    
};