import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';
import { User } from './models/user.js';
import bcrypt from 'bcrypt';
import { isAuth } from './middlewares/isAuth.js';

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

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.json({ success: false, message: "Username or Password not entered."});
    }

    const existingUser = await User.findOne({username: username});
    if(existingUser) {
        res.json({ success: false, message: "Username already exists."});
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = new User({ username: username, password: hashedPass });
    await user.save();

    res.json({ success: true, message: "User created successfully."});
});

app.post("/login", async (req, res) => {
    const {username,  password}  = req.body;
    if(!username || !password) {
        res.json({ success: false, message: "Username or Password not entered."});
    }

    const user = await User.findOne({username: username});
    if(!user) {
        res.redirect("/signup");
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match) {
        res.json({ success: false, message: "Wrong Username or Password"});
    }
    req.session.auth = true;
    res.json({ success: true, message: "Login Successful"});
});

app.get("/hello", isAuth, (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    connectDB();
    console.log(`Listening on port: ${port}`);
});