import { Document, Schema, Model, model } from "mongoose";

export interface ICategoryModel extends Document {
    name: string;
    parent?: string;
    path: string;
}

export var CategorySchema: Schema = new Schema({
    name: String,
    parent: String,
    path: String
}, { collection: 'category' });

export const Category: Model<ICategoryModel> = model<ICategoryModel>("Category", CategorySchema);