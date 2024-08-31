import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    CustomerCode: { type: String, unique: true },
    FirstName: String,
    LastName: String,
    Phone: String,
    Email: { type: String, unique: true },
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
