import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';

dotenv.config();

const app = express();
const port = 3000;

const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    databaseName: "expense-tracker",
    collection: "sessions",
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
}));

app.get("/", (req, res) => {
    req.session.isAuth = true;
    res.send("Hello World!");
});

app.listen(port, () => {
    connectDB();
    console.log(`Listening on port: ${port}`);
});