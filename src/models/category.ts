import { Document, Schema, Model, model } from "mongoose";

export interface ICategoryModel extends Document {
    name: string;
    parent?: string;
    path: string;
}

export var CategorySchema: Schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    parent: String,
    path: {
        type: String,
        required: true,
        trim: true
    }
}, { collection: 'category' });

export const Category: Model<ICategoryModel> = model<ICategoryModel>("Category", CategorySchema);