const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false
    } 
})

// creates virtual id and gets the _id and uses toHexString because _id is an Obj ID we need a hex string  
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
  });
  // Enables virtuals to be able to send value to frontend or API 
  userSchema.set('toJSON', {
    virtuals: true,
  });
  

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;