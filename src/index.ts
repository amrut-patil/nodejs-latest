import { StoreApplication } from "./app";

const {
  PORT = 8080,
} = process.env;

let storeApplication: StoreApplication = new StoreApplication();

storeApplication.httpServer.listen(PORT, () => {
  console.log('server started at http://localhost:' + PORT);
});