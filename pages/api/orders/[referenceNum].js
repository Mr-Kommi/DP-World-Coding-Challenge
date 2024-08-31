import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/Order';
import mongoose from 'mongoose';
import MongoCustomer from '../../../models/Customer';

export default async function handler(req, res) {
    await dbConnect();

    const { referenceNum } = req.query;

    if (req.method === 'PUT') {
        // starting a transaction for the changes
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { Customer, OrderLines } = req.body;

            // Validate OrderLines
            if (!OrderLines || OrderLines.length === 0) {
                throw new Error('OrderLines cannot be empty');
            }

            for (const line of OrderLines) {
                if (!line.ItemNum || !line.ItemDescription) {
                    throw new Error('Each OrderLine must have a non-empty ItemNum and ItemDescription');
                }
            }

            // Validate Customer Data
            if (!Customer.FirstName || !Customer.LastName) {
                throw new Error('Customer FirstName and LastName are required');
            }

            // Find the order by ReferenceNum
            const existingOrder = await Order.findOne({ ReferenceNum: referenceNum });

            if (!existingOrder) {
                throw new Error('Order not found');
            }

            // Update customer information if CustomerCode exists
            let existingCustomer = await MongoCustomer.findOne({ CustomerCode: Customer.CustomerCode });
            if (existingCustomer) {
                existingCustomer.FirstName = Customer.FirstName;
                existingCustomer.LastName = Customer.LastName;
                existingCustomer.Phone = Customer.Phone;
                existingCustomer.Email = Customer.Email;
                await existingCustomer.save({ session });
            } else {
                throw new Error('Customer not found');
            }

            // Update the order details
            existingOrder.Customer = {
                ...existingOrder.Customer,
                ...Customer,
            };
            existingOrder.OrderLines = OrderLines;
            existingOrder.CountryCode = req.body.CountryCode;
            existingOrder.Address = req.body.Address;

            await existingOrder.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ success: true, order: existingOrder });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ success: false, error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const order = await Order.findOne({ ReferenceNum: referenceNum });

            if (!order) {
                return res.status(404).json({ success: false, error: 'Order not found' });
            }

            res.status(200).json({ success: true, order });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
