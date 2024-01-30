const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../../helpers');
const { regexp } = require('../../vars');

const entriesSchema = new Schema( {
                waterVolume: {
                    type: Number,
                    required: [true, 'Set capacity of water'],
                },
                time: {
                    type: String,
                    match: regexp.time,
                    required: [true, 'Time is required'],
                },
            },)

const waterSchema = new Schema(
    {
        date: {
            type: Date,
            required: [true, 'Date is required']
        },
        waterRate: {
            type: Number,
            default: 1500,
            required: [true, 'Water rate is required'],
        },
        totalVolume: {
            type: Number,
            default: 0,
            required: [true, 'Total is required']
        },
        progress: {
            type: Number,
            default: 0,
            required: [true, 'Progress is required']
        },
        dailyEntries: [entriesSchema],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

// waterSchema.methods.getPercent = function () {
//     this.progress = (this.totalVolume / this.waterRate) * 100;
//     console.log('this.progress:', this.progress);
// };
waterSchema.pre(['save', 'updateOne', 'findOneAndUpdate', 'findByIdAndUpdate'], function (next) {
    this.progress = (this.totalVolume / this.waterRate) * 100;
    console.log('this.progress:', this.progress);
    next();
});

waterSchema.post('save', handleMongooseError);

exports.Water = model('water', waterSchema);