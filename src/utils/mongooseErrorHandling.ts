
export class MongooseErrorHanlding {

    public static getErrorMessage(error: any, collectionName: string) {
        let errorMessage = {};
        console.log(JSON.stringify(error));

        if (error.name == "MongoError") {
            if (error.code === 11000) {
                errorMessage["name"] = collectionName + " name is already taken";
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
}