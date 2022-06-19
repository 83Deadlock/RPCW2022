var mongoose = require('mongoose')

var fileSchema = new mongoose.Schema({
    date_creation: String,
    date_submission: String,
    producer: String,
    owner_submission: String,
    title: String,
    type: String,
    filename: String,
    filesZip: [String],
    liked_by: [String]
})

module.exports = mongoose.model('file', fileSchema, 'metadata')