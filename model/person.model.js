const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const personMessageSchema = new Schema({
    name:{type:String},
    startTime:{type:Number},
    endTime:{type:Number},
    messages:[{}]
})

module.exports = mongoose.model("personmessage",personMessageSchema);