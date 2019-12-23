import { Document, Schema, Model, model } from "mongoose";
import { MongooseErrorHanlding } from "../utils/mongooseErrorHandling";

export interface ICategoryModel extends Document {
    name: string;
    parent?: string;
    path: string;
}

export var CategorySchema: Schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Name is mandatory"],
        trim: true
    },
    parent: String,
    path: {
        type: String,
        required: [true, "Path is mandatory"],
        trim: true
    }
}, { collection: 'category' });

CategorySchema.post('findOneAndUpdate', function (error, doc, next) {
    if (error) {
        next({
            serverError: MongooseErrorHanlding.getErrorMessage(error, "Category")
        });
    } else {
        next();
    }
});

export const Category: Model<ICategoryModel> = model<ICategoryModel>("Category", CategorySchema);