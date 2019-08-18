import { Document, Schema, Model, model } from "mongoose";

export interface IUserModel extends Document {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    tokens: [{
        token: {
            type: string;
        }
    }]
}

export var UserSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: String,
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: [{
            type: String,
            required: true
        }]
    }]
}, { collection: "user" })

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);