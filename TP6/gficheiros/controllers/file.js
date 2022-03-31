const mongoose = require('mongoose');

var File = require('../models/file');

module.exports.list = () => {
    return File
            .find()
            .sort({nome:1})
            .exec();
};

module.exports.insert = file => {
    var newFile = new File(file);
    return newFile.save();
};

module.exports.delete = id => {
    return File
            .deleteOne({_id:mongoose.Types.ObjectId(id)})
            .exec();
};

module.exports.lookup = id => {
    return File
            .findOne({_id:mongoose.Types.ObjectId(id)})
            .exec();
};