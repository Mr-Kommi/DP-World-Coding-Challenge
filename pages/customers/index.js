import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Layout from '../../components/Layout';

export default function Customers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            const response = await axiosInstance.get('/customers');
            setCustomers(response.data.customers);
        };

        fetchCustomers();
    }, []);

    return (
        <Layout>
            <h1>Customers</h1>
            <div>
                {customers.map((customer) => (
                    <div key={customer.CustomerCode} className="card">
                        <h3>{customer.FirstName} {customer.LastName}</h3>
                        <p>{customer.Email}</p>
                        <p>{customer.Phone}</p>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
