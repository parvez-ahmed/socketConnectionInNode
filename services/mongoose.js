const mongoose = require("mongoose");


async function makeConnection(){
    try{
        await mongoose.connect("mongodb://localhost:27017/demo");
        console.log("connection established");
    }catch(err){
        console.log("Error in mongoose connections ",err);
        throw(err);
    }
}


module.exports = {
    makeConnection:makeConnection
}