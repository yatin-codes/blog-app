const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        default: "User"
    },

    image: {
        type: String,
        default: ""
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    likes: {
        type: Number,
        default: 0
    },

    dislikes: {
        type: Number,
        default: 0
    },

    shares: {
        type: Number,
        default: 0
    },

    follows: {
        type: Number,
        default: 0
    },

    comments: [
        {
            username: {
                type: String,
                required: true,
                trim: true
            },
            text: {
                type: String,
                required: true,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true }); // createdAt & updatedAt auto

module.exports = mongoose.model("Blog", blogSchema);