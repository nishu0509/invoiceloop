const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    clientEmail: { type: String, required: false },
    dueDate: { type: Date, required: false }
});

module.exports = mongoose.model('Invoice', invoiceSchema);