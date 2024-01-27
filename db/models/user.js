const mongoose = require("mongoose");
const { handleMongooseError } = require("../../helpers");
const Schema = mongoose.Schema;
const { genSalt, hash, compare } = require("bcrypt");
const { regexp } = require("../../vars");

// ========================== Mongoose schemas

const userSchema = new Schema(
  {
    password: {
      type: String,
      minLength: 8,
      maxLength: 64,
      required: [true, "Set password for user"],
      select: false,
    },
    email: {
      type: String,
      match: regexp.emailRegexp,
      unique: true,
      required: [true, "Email is required"],
    },
    name: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["female", "male"],
      default: "female",
    },
    token: {
      type: String,
    },
    waterRate: {
      type: Number,
      max: 15000,
      default: 2000,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: true,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

// ========================== Auto Hash Password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

//=========================== Compare passwords
userSchema.methods.checkPassword = (candidate, passwdHash) =>
  compare(candidate, passwdHash);

const User = mongoose.model("user", userSchema);

module.exports = User;
