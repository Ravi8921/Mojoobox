const mongoose = require('mongoose')

const {validator} = require('../utils')

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
       
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.validateEmail,
            message: 'Please enter a valid email',
            isAsync: false
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 15,
    },
    isDeleted: {
        type: Boolean,
        default: false,
      },
    department : {
        type: String,
        required: true,
       
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)