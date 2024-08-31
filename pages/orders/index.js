import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Layout from '@/components/Layout';
import OrderCard from '@/components/OrderCard';
import Pagination from '@mui/material/Pagination';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await axiosInstance.get(`/orders`, {
                params: {
                    page: page,
                    limit: 5,
                },
            });
            setOrders(response.data.orders);
            setTotalPages(response.data.totalPages);
        };

        fetchOrders();
    }, [page]);

    return (
        <Layout>
            <h1>Orders</h1>
            <div>
                {orders.map((order) => (
                    <OrderCard key={order.ReferenceNum} order={order} />
                ))}
            </div>
            <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
            />
        </Layout>
    );
}
