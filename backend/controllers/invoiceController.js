const Invoice = require('../models/invoiceModel');

const createInvoice = async (req, res) => {
    try {
        const { clientName, clientEmail, amount, dueDate, status } = req.body;
        const invoice = new Invoice({
            user: req.user.id || req.user._id,
            clientName,
            clientEmail,
            amount,
            dueDate,
            status: status || "Pending"
        });
        await invoice.save();
        res.status(201).json({ success: true, message: "Invoice created successfully", invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id || req.user._id });
        res.status(200).json({ success: true, invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id || req.user._id
        });

        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateInvoice = async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id || req.user._id },
            req.body,
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        res.status(200).json({ success: true, updatedInvoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createInvoice, getInvoices, deleteInvoice, updateInvoice };