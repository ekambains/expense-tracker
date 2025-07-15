import express from 'express';
import { Expense } from '../models/expense.js';
import { isAuth } from '../middlewares/isAuth.js';
import mongoose from 'mongoose';

export const expenseRouter = express.Router();

expenseRouter.get("/:userId", isAuth, async (req, res) => {
    const { userId } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({success: false, message: "Invalid userId"});
    }

    try {   
        const expenses = await Expense.find({userId: userId});
        res.status(200).json({success: true, data: expenses});
    } catch (error) {
        console.error(`Error in getting expenses: ${error}`);
        res.status(500).json({success: false, message: "Server Error"});
    }
});

expenseRouter.post("/:userId", isAuth, async (req, res) => {
    const { userId } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(404).json({success: false, message: "Invalid userId"});
    }

    try {
        const { name, amount, category, date } = req.body;
        const expense = new Expense({name, amount, category, date, userId});
        await expense.save();
        res.status(201).json({success: true, message: "Expense created successfully"});
    } catch (error) {
        console.error(`Error in posting expense: ${error}`);
        res.status(500).json({success: false, message: "Server Error"});
    }
});

expenseRouter.put("/:userId/:expenseId", isAuth, async (req, res) => {
    const { expenseId } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(expenseId)) {
        res.status(404).json({success: false, message: "Invalid expenseId"});
    }

    try {
        const newExpense = req.body;
        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, newExpense, {new: true});
        res.status(200).json({success: true, data: updatedExpense});
    } catch (error) {
        console.error(`Error in updating expense: ${error}`);
        res.status(500).json({success: false, message: "Server Error"});
    }
});

expenseRouter.delete("/:userId/:expenseId", isAuth, async (req, res) => {
    const { expenseId } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(expenseId)) {
        res.status(404).json({success: false, message: "Invalid expenseId"});
    }

    try {
        await Expense.findByIdAndDelete(expenseId);
        res.status(200).json({success: true, message: "Expense deleted successfully"});
    } catch (error) {
        console.error(`Error in delete expense: ${error}`);
        res.status(500).json({success: false, message: "Server Error"});
    }
});