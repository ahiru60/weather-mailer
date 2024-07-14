require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../Models/user'); 
const fetchData = require('./Utils/apiService');
const { execute } = require('./Utils/scheduler');

// get all users
router.get('/', async(req, res) => {
    try{
        execute();
        const users = await User.find();
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});
// get one user
router.post('/user',async(req, res) => {
    try{
        const user = await User.find({},{email:req.body.email,password:req.body.password});
        res.json({name:user});
    }catch(err){
        res.status(404).json({message:err.message});
    }
    
});
// create user
router.post('/', async(req, res) => {
    const userData = req.body;
    let location
    if(userData.stateCode != null){stateCode =  userData.stateCode + ","}
    uri = `http://api.openweathermap.org/geo/1.0/direct?q=`+userData.city+`,`+stateCode+userData.countryCode+`&limit=1&appid=`+ process.env.OPENWEATHER_API_KEY;
    try{
        location = await fetchData(uri);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({messagee:error});
        return(error);
    }
    const user = new User({
        name: userData.name,
        email: userData.email,
        password:userData.password,
        location: {
            city: userData.city,
            stateCode:userData.stateCode,
            countryCode:userData.countryCode,
            longitude: location[0]["lon"],
            latitude: location[0]["lat"]

        }
    })

    try{
        const newUser = await user.save();
        res.status(201).json(newUser)
    }
    catch(err){
        res.status(400).json({message: error.message})
    }
    
});

module.exports = router;
