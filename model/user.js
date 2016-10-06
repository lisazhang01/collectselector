var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');


var UserSchema = new Schema({
    local            : {
        email        : {type: String, unique: true},
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        secret       : String,
        displayName  : String,
        username     : String,
        img          : String
    },
    shortlist        : [{
        name         : String,
        address      : String,
        url          : String
    }]
});


UserSchema.pre('save', function(next){ //Save pw before creating user
  const user = this;
  if(!user.isModified('password')){
    return next();
  }
  bcrypt.genSalt(10, function(err, salt){
    if(err) {
      console.log('Could not generate salt', err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash){
      user.password = hash;
    });
  });
});

/*
* Compare password
*/
UserSchema.methods.comparePassword = function(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    cb(err, isMatch); //checks if true or false
  });
}


const User = mongoose.model('User', UserSchema);

module.exports = User;