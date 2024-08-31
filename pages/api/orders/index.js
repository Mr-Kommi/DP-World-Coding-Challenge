import mongoose from 'mongoose';
import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/Order';
import MongoCustomer from '../../../models/Customer';
import config from '../../../config/config';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        // starting a transaction for the changes
        const session = await mongoose.startSession(); 
        session.startTransaction();

        try {
            const { ReferenceNum, Customer, OrderLines } = req.body;

            // Validate OrderLines
            if (!OrderLines || OrderLines.length === 0) {
                throw new Error('OrderLines cannot be empty');
            }

            // Validate Customer Data
            if (!Customer.FirstName || !Customer.LastName) {
                throw new Error('Customer FirstName and LastName are required');
            }
            for (const line of OrderLines) {
                if (!line.ItemNum || !line.ItemDescription) {
                    throw new Error('Each OrderLine must have a non-empty ItemNum and ItemDescription');
                }
            }

            let orderReferenceNum = ReferenceNum || generateOrderReference();
            let existingOrder = await Order.findOne({ ReferenceNum: orderReferenceNum });

            if (existingOrder) {
                throw new Error('Duplicate ReferenceNum');
            }

            let customerCode = Customer.CustomerCode || generateCustomerCode();
            let existingCustomer = await MongoCustomer.findOne({ CustomerCode: customerCode });

            if (!existingCustomer) {
                if (!Customer.Email || !Customer.Phone) {
                    throw new Error('Customer Email and Phone are required for new customers');
                }
                const newCustomer = new MongoCustomer({
                    ...Customer,
                    CustomerCode: customerCode
                });
                await newCustomer.save({ session });
            }

            const newOrder = new Order({
                ...req.body,
                ReferenceNum: orderReferenceNum,
                Customer: {
                    ...Customer,
                    CustomerCode: customerCode
                }
            });

            await newOrder.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({ success: true, order: newOrder });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ success: false, error: error.message });
        }
    } else if (req.method === 'GET') {
        try {
            const { page = 1, limit = 5 } = req.query;

            const orders = await Order.find({})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const count = await Order.countDocuments();

            res.status(200).json({
                orders,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}

function generateOrderReference() {
    return `${config.ORDER_REFERENCE_PREFIX}${Math.random().toString(36).substr(2, config.ORDER_REFERENCE_NUM_LENGTH).toUpperCase()}`;
}

function generateCustomerCode() {
    return `${config.CUSTOMER_CODE_PREFIX}${Math.random().toString(36).substr(2, config.CUSTOMER_CODE_LENGTH).toUpperCase()}`;
}
