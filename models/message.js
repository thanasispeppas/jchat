// Message model

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  text: {
    type: String,
    trim: true,
    validate: [ /^.{1,256}$/, "Too long message" ]
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('Message', messageSchema);
