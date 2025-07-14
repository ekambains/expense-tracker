import mongoose, { Mongoose } from "mongoose";

const expenseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Travel', 'Other'],
    },
    date: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export const Expense = mongoose.model("Expense", expenseSchema);