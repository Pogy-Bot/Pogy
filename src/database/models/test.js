// models/test.js
const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
 name: {
    type: String,
 },
 age: {
    type: Number,
 },
});

module.exports = mongoose.model('Test', TestSchema);
