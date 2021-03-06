
export class MongooseErrorHanlding {

    static CollectionUniqueKeyMap = {
        product: "name",
        category: "name",
        user: "email"
    };
    
    static CollectionUniqueKeyMapLabel = {
        product: "Product name",
        category: "Category name",
        user: "Email"
    };

    public static getErrorMessage(error: any, collectionName: string) {
        let errorMessage = {};

        if (error.name == "MongoError") {
            if (error.code === 11000) {
                errorMessage[MongooseErrorHanlding.CollectionUniqueKeyMap[collectionName]] = MongooseErrorHanlding.CollectionUniqueKeyMapLabel[collectionName] + " is already taken";
            }
        }
        else if (error.name == "ValidationError") {
            for (let field in error.errors) {
                if (error.errors[field].message) {
                    errorMessage[field] = error.errors[field].message;
                    break;
                }
            }
        }

        if (Object.keys(errorMessage).length === 0 && errorMessage.constructor === Object) {
            errorMessage["unknown"] = "Something went wrong!";
        }
        return errorMessage;
    }

    public static getDeleteNoRecordErrorMessage() {
        let errorMessage = { serverError: {} };
        errorMessage.serverError["unknown"] = "Record doesn't exists";
        return errorMessage;
    }

    public static getBuiltErrorMessage(message: string) {
        let errorMessage = { serverError: {} };
        errorMessage.serverError["unknown"] = message;
        return errorMessage;
    }
}