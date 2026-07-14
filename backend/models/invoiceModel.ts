import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IInvoice extends Document {
    user: Types.ObjectId;
    clientName: string;
    amount: number;
    status: string;
    clientEmail?: string;
    dueDate?: Date;
}

const invoiceSchema = new Schema<IInvoice>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clientName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    clientEmail: { type: String, required: false },
    dueDate: { type: Date, required: false }
});

const Invoice: Model<IInvoice> = mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;
