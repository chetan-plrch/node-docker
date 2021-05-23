const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'Username is require'],
        unique: true
    },
    password: {
        type: String,
        require: [true, "User must have a password"]
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;