const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../../helpers");
const { regexp } = require("../../vars");

const entriesSchema = new Schema({
  waterVolume: {
    type: Number,
    required: [true, "Set capacity of water"],
  },
  time: {
    type: String,
    match: regexp.time,
    required: [true, "Time is required"],
  },
});

const waterSchema = new Schema(
  {
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    waterRate: {
      type: Number,
      default: 1500,
      required: [true, "Water rate is required"],
    },
    totalVolume: {
      type: Number,
      default: 0,
      required: [true, "Total is required"],
    },
    progress: {
      type: Number,
      default: 0,
      required: [true, "Progress is required"],
    },
    dailyEntries: [entriesSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

waterSchema.pre('save', function (next) {
    this.progress = (this.totalVolume / this.waterRate) * 100;
    next();
});

waterSchema.post('findOneAndUpdate', function (doc) {
  if (!doc) return
    doc.progress = Math.floor((doc.totalVolume / doc.waterRate) * 100);
    doc.save()
});

waterSchema.post('save', handleMongooseError);

exports.Water = model("water", waterSchema);
