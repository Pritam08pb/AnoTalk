const mongoose = require('mongoose');


const msgSchema = new mongoose.Schema({
    username: String,
    message: String,
    user:String,
    msgId:{ type: String, unique: true },
    timestamp: { type: Date, default: Date.now },
});

const Messages = mongoose.models.Messages || mongoose.model('Messages',msgSchema);

module.exports = Messages;




