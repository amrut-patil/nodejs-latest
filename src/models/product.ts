import { Document, Schema, Model, model } from 'mongoose';
import { MongooseErrorHanlding } from '../utils/mongooseErrorHandling';

export interface IProductModel extends Document {
  name: string;
  categories: string;
}

export var ProductSchema: Schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Name is mandatory"],
    trim: true,
  },
  categories: {
    type: String,
    required: [true, "Categories is mandatory"],
  },
  attributes: {
    type: Array
  }
}, { collection: 'product' });

ProductSchema.post('findOneAndUpdate', function (error, doc, next) {
  if (error) {
    next({
      serverError: MongooseErrorHanlding.getErrorMessage(error, "Product")
    });
  } else {
    next();
  }
});

export const Product: Model<IProductModel> = model<IProductModel>("Product", ProductSchema);