import express from 'express';
import {
    createInvoice,
    getInvoices,
    deleteInvoice,
    updateInvoice
} from '../controllers/invoiceController';
import protect from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/create', protect, createInvoice);
router.get('/all', protect, getInvoices);
router.delete('/delete/:id', protect, deleteInvoice);
router.put('/update/:id', protect, updateInvoice);

export default router;
