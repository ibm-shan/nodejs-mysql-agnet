const mongoose = require("mongoose");

const userSchemea  = new mongoose.Schema({
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
    }
    // createAt : {
    //     type : Date,
    //     default : Date.now
    // },
    // updateAt : {
    //     type : Date,
    //     default : Date.now
    // }
}, {
    timestamps  : true
});

module.exports = mongoose.model('User', userSchemea); // mongo 디비에 생성되는 스키마 이름 