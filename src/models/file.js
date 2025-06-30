const mongoose = require("mongoose");
const {Schema} = mongoose;

// const fileSchema = new Schema({
//     filename: { type: String, required: true },
//     path: { type: String, required: true },
//     size: { type: Number, required: true },
//     mimetype: { type: String, required: true },
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true }
// }, { timestamps: true });

// module.exports = mongoose.model("File", fileSchema);


const fileSchema = new Schema({
    filename:{
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    email: {
        type: String,
        default: ""
       
    }
});

module.exports = mongoose.model("File", fileSchema);
