var mongoose = require('mongoose')
var File = require('../models/metadata')
var Noticia = require('../models/noticia')
var Comentario = require('../models/comentario')

module.exports.list = () => {
    return File
            .find()
            .sort({filename: 1})
            .exec()
}

module.exports.listTipo = tipo => {
    return File
            .find({type: tipo})
            .sort({filename: 1})
            .exec()
}


module.exports.listPalavra = palavra => {
    var p = new RegExp(palavra)
    return File
            .find({title: p})
            .sort({filename: 1})
            .exec()
}

module.exports.listFavoritos = username => {
    return File
            .find({liked_by: username})
            .sort({filename: 1})
            .exec()
}

module.exports.lookUp = id => {
    return File
            .findOne({_id: mongoose.Types.ObjectId(id)})
            .exec()
}

module.exports.lookUpFile = f => {
    return File
            .findOne({filename: f})
            .exec()
}

module.exports.insert = file => {
    var newFile = new File(file)
    return newFile.save()
}

module.exports.delete = id => {
    return File
            .deleteOne({_id: mongoose.Types.ObjectId(id)})
            .exec()
}

module.exports.deleteFile = f => {
    return File
            .deleteOne({filename: f})
            .exec()
}

module.exports.updateFile = (f, tipo) => {
    return File
            .findOneAndUpdate({filename: f}, {type: tipo}, {new: true})
            .exec()
}

module.exports.insertNoticia = noticia => {
    var newNoticia = new Noticia(noticia)
    return newNoticia.save()
}

module.exports.listaNoticia = () => {
    return Noticia
            .find()
            .sort({date: -1})
            .exec()
}

module.exports.listaNoticiaUsers = () => {
    return Noticia
            .find({visible: 1})
            .sort({date: -1})
            .exec()
}

module.exports.deleteNoticia = id => {
    return Noticia
            .deleteOne({_id: id})
            .exec()
}

module.exports.deleteAll = () => {
    return Noticia.collection.drop()
}

module.exports.editaNoticiaV = id => {
    return Noticia
            .findOneAndUpdate({_id: id}, {visible: 1}, {new: true})
            .exec()
}

module.exports.editaNoticiaI = id => {
    return Noticia
            .findOneAndUpdate({_id: id}, {visible: 0}, {new: true})
            .exec()
}


module.exports.addLike = (f, user) => {
    return File
            .findOneAndUpdate({filename: f}, {$push:{liked_by: user}})
            .exec()
}

module.exports.removeLike = (f, user) => {
    return File
            .findOneAndUpdate({filename: f}, {$pull:{liked_by: user}})
            .exec()
}

module.exports.listaComentario = f => {
    return Comentario
            .find({filename: f})
            .sort({date: -1})
            .exec()
}


module.exports.insertComentario = c => {
    var newComentario = new Comentario(c)
    return newComentario.save()
}

module.exports.deleteComentario = id => {
    return Comentario
            .deleteOne({_id: id})
            .exec()
}


module.exports.updateComentario = (id, d) => {
    return Comentario
            .findOneAndUpdate({_id: id}, {descricao: d}, {new: true})
            .exec()
}