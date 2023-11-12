const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


//creating the schema for the user data
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender:{
        type:String,
    },
    customername:{
        type:String,
        required:true
    },
    preferredcat:{
        type:String
    }
});

// UserSchema.plugin(passportLocalMongoose, {
//     usernameField: 'username', 
//     usernameUnique: true // Ensures uniqueness of the custom username 
// });
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'username',
});
//UserSchema.plugin(passportLocalMongoose);
    

module.exports = mongoose.model('User', UserSchema);