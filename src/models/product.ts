import { Document, Schema, Model, model } from 'mongoose';

export interface IProductModel extends Document {
    name: string;
    categories: string;
}

export var ProductSchema: Schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    categories: {
        type: String,
        required: true
    }
}, { collection: 'product' });

export const Product: Model<IProductModel> = model<IProductModel>("Product", ProductSchema);