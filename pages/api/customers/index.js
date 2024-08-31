import dbConnect from '../../../utils/dbConnect';
import CustomerCollection from '../../../models/Customer';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const customers = await CustomerCollection.find({});
            res.status(200).json({ success: true, customers });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
