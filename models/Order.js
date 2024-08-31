import mongoose from 'mongoose';

const OrderLineSchema = new mongoose.Schema({
    ItemNum: String,
    ItemDescription: String,
}, { _id: false });

const AddressSchema = new mongoose.Schema({
    FullName: String,
    AddressType: String,
    AddressLine1: String,
    AddressLine2: String,
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
    CustomerCode: String,
    FirstName: String,
    LastName: String,
    Phone: String,
    Email: String,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    ReferenceNum: { type: String, unique: true },
    CountryCode: String,
    Address: AddressSchema,
    Customer: CustomerSchema,
    OrderLines: {
        type: [OrderLineSchema],
        validate: [arrayLimit, 'OrderLines cannot be empty']
    }
});

function arrayLimit(val) {
    return val.length > 0;
}

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
