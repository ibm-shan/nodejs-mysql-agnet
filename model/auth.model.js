const mongoose = require("mongoose");

const authSchema  = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        min: 6, 
        max: 255
    },
    email : {
        type : String, 
        required : true, 
        min : 6,
        max : 255
    },
    password : {
        type : String, 
        required : true,
        min : 6,
        max : 1024
    },
    date : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('Auth', authSchema); // mongo 디비에 생성되는 스키마 이름 