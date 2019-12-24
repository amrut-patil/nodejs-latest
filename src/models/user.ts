import { Document, Schema, Model, model } from "mongoose";
import * as validator from "validator";
import * as jwt from "jsonwebtoken";
import * as bcrytp from "bcryptjs";
import { MongooseErrorHanlding } from "../utils/mongooseErrorHandling";

export interface IUserModel extends Document {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    tokens: [{
        token: {
            type: string;
        }
    }];
}

export var UserSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is mandatory"],
        lowercase: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
            return true;
        }
    },
    firstname: {
        type: String,
        required: [true, "First Name is mandatory"],
    },
    lastname: {
        type: String,
        required: [true, "Last Name is mandatory"],
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"],
        validate: (value) => {
            if (!validator.isLength(value, { min: 4 })) {
                throw new Error('Password too short - minimum length is 4 characters');
            }
            if (value !== this.confirmpassword) {
                throw new Error('Password and confirm password do not match');
            }

            return true;
        },
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, { collection: "user" });

UserSchema.pre('save', async function <IUserModel>(next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrytp.hash(this.password, 8);
        }
    } catch (error) {
        throw new Error(error);
    }
    next();
});

UserSchema.post('save', function (error, doc, next) {
    if (error) {
      next({
        serverError: MongooseErrorHanlding.getErrorMessage(error, "Email")
      });
    } else {
      next();
    }
  });

UserSchema.virtual("confirmpassword").
    get(() => { return this.confirmpassword }).
    set((value) => { this.confirmpassword = value });

UserSchema.methods.generateAuthenticationToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'estorekey', {expiresIn: 1800});
    user.tokens = user.tokens.concat({ token })
    try {
        await user.save();
    } catch (error) {
        throw new Error(error);
    }
    return token;
}

//this is called whenever express calls stringify(), here we override the values
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.tokens;

    return userObject;
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Email not registered");
    }
    user.set('confirmpassword', user.password); //virtual fields are not set with findOne
    const isMatch = await bcrytp.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
}

export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);