import express from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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