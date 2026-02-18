import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, trim: true },
    created_at: { type: Date, default: Date.now },
});

expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
