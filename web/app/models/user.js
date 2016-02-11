var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new Schema({
  email: {
    type: String,
    unique: "L'email doit être unique",
    required: "L'email est obligatoire et unique.",
    validate: [/.+\@.+\..+/, 'L\'email n\'est pas valide']
  },
  password: {
    type: String,
    required: "Le mot de passe est obligatoire."
  },
  lastName: {
    type: String,
    required: "Le nom est obligatoire."
  },
  firstName: {
    type: String,
    required: "Le prenom est obligatoire."
  },
  token: {
    type: String,
    unique: true,
    required: false,
    sparse: true
  },
  isAdmin: {
    type: Boolean,
    required: false
  },
  date_token: {
    type: Date
  },
  device_token: {
    type: String,
    unique: true,
    required: false,
    sparse: true
  },
  groupes: Array
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

UserSchema.plugin(uniqueValidator);


UserSchema
  .virtual('fullName')
  .get(function () {
    return this.firstName + ' ' + this.lastName;
  });

mongoose.model('users', UserSchema);
