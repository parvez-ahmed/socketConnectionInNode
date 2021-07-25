const crypto = require("crypto");
const config = require("./config");

function convertRowDataWithHashKey(datas){
    return datas.map((data)=> {
       let key = hashKey(JSON.stringify(data)); 
       return {
           ...data,
           security:key
       }
    })
}

function hashKey(data){
    return crypto.createHash("sha256").update(data).digest("hex")
}

function encryptMessages(messages){
    return messages.map(message=>{
        const cipher = crypto.createCipher("aes-256-ctr", config.encryptKey);
        return cipher.update(JSON.stringify(message), "binary", "hex")
    })
}

function decryptMessage(message){
    const cipher = crypto.createDecipher("aes-256-ctr", config.encryptKey);
    return cipher.update(message, "hex", "binary")
}


module.exports = {
    convertRowDataWithHashKey:convertRowDataWithHashKey,
    encryptMessages:encryptMessages,
    decryptMessage:decryptMessage,
    hashKey:hashKey
};