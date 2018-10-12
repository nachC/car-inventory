const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: [1000, 'Year must be 4 digits long'],
        max: [9999, 'Year must be 4 digits long']
    },
    hp: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const Cars = mongoose.model('car', carSchema);

module.exports = Cars;