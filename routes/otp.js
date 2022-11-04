const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/otp");

const otpSchema = mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 },
    },
  },
);

module.exports = mongoose.model("otp", otpSchema);
