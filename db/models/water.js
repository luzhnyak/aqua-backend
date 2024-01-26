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
        },
        waterRate: {
            type: Number,
            default: 1500,
            required: [true, 'Water rate is required'],
        },
        percentOfRate: {
            type: Number,
            default: 0,
            required: [true, 'Percent is required']
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

// waterSchema.pre('save', async function (next) {
//     this.percentOfRate = this.dailyEntries.reduce((acc, { waterVolume }) => acc + waterVolume, 0) / this.waterRate * 100;
//     next()
// })

waterSchema.post('save', handleMongooseError);

exports.Water = model('water', waterSchema);
