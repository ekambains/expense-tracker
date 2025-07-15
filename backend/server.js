import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';
import { isAuth } from './middlewares/isAuth.js';
import { authRouter } from './routes/authRoutes.js';
import { expenseRouter } from './routes/expenseRoutes.js';

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

app.use(express.json());

app.use("/api", authRouter);
app.use("/api", expenseRouter);

app.get("/hello", isAuth, (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    connectDB();
    console.log(`Listening on port: ${port}`);
});