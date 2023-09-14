const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isMember: { type: String, default: false },
});

userSchema.virtual("name").get(function () {
  let fullName = "";

  if (this.firstName && this.lastName) {
    fullName = `${this.firstName} ${this.lastName}`;
  }

  return fullName;
});

module.exports = mongoose.model("User", userSchema);
