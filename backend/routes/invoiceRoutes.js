const express = require('express');
const router = express.Router();
const { 
    createInvoice, 
    getInvoices, 
    deleteInvoice, 
    updateInvoice 
} = require('../controllers/invoiceController');
const protect = require('../middlewares/authMiddleware');

router.post('/create', protect, createInvoice);
router.get('/all', protect, getInvoices);
router.delete('/delete/:id', protect, deleteInvoice);
router.put('/update/:id', protect, updateInvoice);

module.exports = router;