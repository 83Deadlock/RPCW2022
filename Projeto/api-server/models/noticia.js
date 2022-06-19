var mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({
    username: String,
    action: String,
    date: String,
    visible: Number
})

module.exports = mongoose.model('noticia', noticiaSchema, 'noticias')