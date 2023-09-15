const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    content: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

messageSchema.virtual("createdAtFormatted").get(function () {
  return this.createdAt ? DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATETIME_SHORT) : "";
});

module.exports = mongoose.model("Message", messageSchema);
