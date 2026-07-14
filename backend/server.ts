import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import invoiceRoutes from './routes/invoiceRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/invoice', invoiceRoutes);

app.get('/', (req, res) => {
    res.send('InvoiceLoop API running successfully!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
