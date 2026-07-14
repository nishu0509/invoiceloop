import { Request, Response } from 'express';
import Invoice from '../models/invoiceModel';

export const createInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { clientName, clientEmail, amount, dueDate, status } = req.body;
        const invoice = new Invoice({
            user: req.user?.id || req.user?._id,
            clientName,
            clientEmail,
            amount,
            dueDate,
            status: status || 'Pending'
        });
        await invoice.save();
        return res.status(201).json({ success: true, message: 'Invoice created successfully', invoice });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ success: false, message });
    }
};

export const getInvoices = async (req: Request, res: Response): Promise<Response> => {
    try {
        const invoices = await Invoice.find({ user: req.user?.id || req.user?._id });
        return res.status(200).json({ success: true, invoices });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ success: false, message });
    }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const invoice = await Invoice.findOneAndDelete({
            _id: req.params.id,
            user: req.user?.id || req.user?._id
        });

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        return res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ success: false, message });
    }
};

export const updateInvoice = async (req: Request, res: Response): Promise<Response> => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: req.params.id, user: req.user?.id || req.user?._id },
            req.body,
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        return res.status(200).json({ success: true, updatedInvoice });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res.status(500).json({ success: false, message });
    }
};
