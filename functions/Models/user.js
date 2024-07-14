const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true,

    },
    location:{
        type:Object,
        required:true,

    },
    WeatherData:{
        type:Object,

    }
})
const User = mongoose.model('User',userSchema)

module.exports = User;