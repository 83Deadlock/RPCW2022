var mongoose = require('mongoose')

var comentarioSchema = new mongoose.Schema({
    username: String,
    descricao: String,
    date: String,
    filename: String
})

module.exports = mongoose.model('comentario', comentarioSchema, 'comentarios')