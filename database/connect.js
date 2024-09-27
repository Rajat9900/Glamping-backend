const mongoose = require("mongoose");


// const uri = "mongodb+srv://ranjanacodeskape:VZrEUGDdRuDwxcea@glampingapi.ktx34.mongodb.net/GlampingApi?retryWrites=true&w=majority&appName=GlampingApi";

const connectDb = (uri) => {
    console.log("connected database")
    return mongoose.connect(uri);
    
};

module.exports = connectDb;
