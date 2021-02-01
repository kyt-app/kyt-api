const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    kytNumber: {
        type: Number, 
        required: true
    },
    passportNumber: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    tests: {
        type: Array,
        required: false
    },
    pfpUrl: {
        type: String,
        required: false,
        default: "https://i.imgur.com/twPSMdV.jpg"
    }
}, {
    collection: 'Users'
});

const User = mongoose.model('User', userSchema)
module.exports = User;