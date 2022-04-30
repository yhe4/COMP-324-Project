const mongoose = require('mongoose');

//Schema allows us to format the information
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, 'cannot be blank']
    }, lname: {
        type: String,
        required: [true, 'cannot be blank']
    }, email: {
        type: String,
        required: [true, 'cannot be blank']
    }, username: {
        type: String,
        required: [true, 'cannot be blank']
    }, password: {
        type: String,
        required: [true, 'cannot be blank']
    }
})

module.exports = mongoose.model('User', userSchema)