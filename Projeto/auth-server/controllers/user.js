var User = require('../models/user')


module.exports.listar = () => {
    return User
        .find()
        .sort({name: 1})
        .exec()
}

module.exports.lookUp = uname => {
    return User
        .find({username: uname})
        .exec()
}

module.exports.consultar = uname => {
    return User
        .findOne({username: uname})
        .exec()
}

module.exports.inserir = u => {
    var novo = new User(u)
    return novo.save()
}

module.exports.remover = function(uname){
    return User.deleteOne({username: uname})
}

module.exports.alterarUsername = function(username, uname){
    return User
            .findOneAndUpdate({username: username}, {username: uname}, {new: true})
            .exec()
}

module.exports.alterarName = function(username, name){
    return User
            .findOneAndUpdate({username: username}, {name: name}, {new: true})
            .exec()
}
