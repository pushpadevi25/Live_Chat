import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:function() {
            return !this.fileUrl; // Message is required only if there's no file
        }
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'audio', 'file'],
        default: 'text'
    },
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    },
    fileSize: {
        type: Number
    },
    fileType: {
        type: String
    }
},{timestamps:true});

export const Message = mongoose.model("Message", messageModel);