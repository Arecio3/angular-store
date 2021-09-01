const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
    },
    color: {
        type: String,
    }
});

// creates virtual id and gets the _id and uses toHexString because _id is an Obj ID we need a hex string  
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
  });
  // Enables virtuals to be able to send value to frontend or API 
  categorySchema.set('toJSON', {
    virtuals: true,
  });
  

exports.Category = mongoose.model('Category', categorySchema);