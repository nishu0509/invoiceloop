const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const invoiceRoutes = require('./routes/invoiceRoutes');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/invoice', invoiceRoutes);

app.get('/', (req, res) => {
    res.send('InvoiceLoop API running successfully!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});