import { useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axiosInstance';
import Layout from '../../components/Layout';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

export default function CreateOrder() {
    const [order, setOrder] = useState({
        ReferenceNum: '',
        CountryCode: '',
        Address: {
            FullName: '',
            AddressType: '',
            AddressLine1: '',
            AddressLine2: '',
        },
        Customer: {
            CustomerCode: '',
            FirstName: '',
            LastName: '',
            Phone: '',
            Email: '',
        },
        OrderLines: [
            { ItemNum: '', ItemDescription: '' },
        ],
    });

    const [error, setError] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: value,
        }));
    };

    const handleNestedChange = (e, section) => {
        const { name, value } = e.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [section]: {
                ...prevOrder[section],
                [name]: value,
            },
        }));
    };

    const handleOrderLineChange = (index, e) => {
        const { name, value } = e.target;
        const newOrderLines = [...order.OrderLines];
        newOrderLines[index][name] = value;
        setOrder((prevOrder) => ({
            ...prevOrder,
            OrderLines: newOrderLines,
        }));
    };

    const handleAddOrderLine = () => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            OrderLines: [...prevOrder.OrderLines, { ItemNum: '', ItemDescription: '' }],
        }));
    };

    const handleRemoveOrderLine = (index) => {
        const newOrderLines = order.OrderLines.filter((_, i) => i !== index);
        setOrder((prevOrder) => ({
            ...prevOrder,
            OrderLines: newOrderLines,
        }));
    };

    const handleSave = async () => {
        setError(null);
        try {
            await axiosInstance.post('/orders', order);
            alert('Order created successfully!');
            router.push('/orders');
        } catch (error) {
            console.error('Error creating order:', error);
            const errorMessage = error.response?.data?.error || 'Failed to create order. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const handleUploadXML = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(e.target.result, 'text/xml');
                const referenceNum = xmlDoc.getElementsByTagName('ReferenceNum')[0]?.textContent;
                const countryCode = xmlDoc.getElementsByTagName('CountryCode')[0]?.textContent;
                const fullName = xmlDoc.getElementsByTagName('FullName')[0]?.textContent;
                const addressType = xmlDoc.getElementsByTagName('AddressType')[0]?.textContent;
                const addressLine1 = xmlDoc.getElementsByTagName('AddressLine1')[0]?.textContent;
                const addressLine2 = xmlDoc.getElementsByTagName('AddressLine2')[0]?.textContent;
                const customerCode = xmlDoc.getElementsByTagName('CustomerCode')[0]?.textContent;
                const firstName = xmlDoc.getElementsByTagName('FirstName')[0]?.textContent;
                const lastName = xmlDoc.getElementsByTagName('LastName')[0]?.textContent;
                const phone = xmlDoc.getElementsByTagName('Phone')[0]?.textContent;
                const email = xmlDoc.getElementsByTagName('Email')[0]?.textContent;
                const orderLines = Array.from(xmlDoc.getElementsByTagName('OrderLine')).map(line => ({
                    ItemNum: line.getElementsByTagName('ItemNum')[0]?.textContent,
                    ItemDescription: line.getElementsByTagName('ItemDescription')[0]?.textContent,
                }));

                setOrder({
                    ReferenceNum: referenceNum || '',
                    CountryCode: countryCode || '',
                    Address: {
                        FullName: fullName || '',
                        AddressType: addressType || '',
                        AddressLine1: addressLine1 || '',
                        AddressLine2: addressLine2 || '',
                    },
                    Customer: {
                        CustomerCode: customerCode || '',
                        FirstName: firstName || '',
                        LastName: lastName || '',
                        Phone: phone || '',
                        Email: email || '',
                    },
                    OrderLines: orderLines.length ? orderLines : [{ ItemNum: '', ItemDescription: '' }],
                });
            };
            reader.readAsText(file);
        }
    };

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>Create Order</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box mt={2} mb={3}>
                <InputLabel htmlFor="xml-upload">Upload XML to Pre-fill Order Details</InputLabel>
                <Input
                    type="file"
                    id="xml-upload"
                    onChange={handleUploadXML}
                    fullWidth
                    inputProps={{ accept: '.xml' }}
                />
            </Box>

            <Divider />
            <Typography variant="h6" mt={3} mb={2}>Customer Information</Typography>
            <Box>
                <TextField
                    name="CustomerCode"
                    value={order.Customer.CustomerCode}
                    onChange={(e) => handleNestedChange(e, 'Customer')}
                    label="Customer Code"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="FirstName"
                    value={order.Customer.FirstName}
                    onChange={(e) => handleNestedChange(e, 'Customer')}
                    label="First Name"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="LastName"
                    value={order.Customer.LastName}
                    onChange={(e) => handleNestedChange(e, 'Customer')}
                    label="Last Name"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="Phone"
                    value={order.Customer.Phone}
                    onChange={(e) => handleNestedChange(e, 'Customer')}
                    label="Phone"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="Email"
                    value={order.Customer.Email}
                    onChange={(e) => handleNestedChange(e, 'Customer')}
                    label="Email"
                    fullWidth
                    margin="normal"
                />
            </Box>

            <Divider />
            <Typography variant="h6" mt={3} mb={2}>Address Information</Typography>
            <Box>
                <TextField
                    name="CountryCode"
                    value={order.CountryCode}
                    onChange={handleChange}
                    label="Country Code"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="FullName"
                    value={order.Address.FullName}
                    onChange={(e) => handleNestedChange(e, 'Address')}
                    label="Full Name"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="AddressType"
                    value={order.Address.AddressType}
                    onChange={(e) => handleNestedChange(e, 'Address')}
                    label="Address Type"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="AddressLine1"
                    value={order.Address.AddressLine1}
                    onChange={(e) => handleNestedChange(e, 'Address')}
                    label="Address Line 1"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="AddressLine2"
                    value={order.Address.AddressLine2}
                    onChange={(e) => handleNestedChange(e, 'Address')}
                    label="Address Line 2"
                    fullWidth
                    margin="normal"
                />
            </Box>

            <Divider />
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="h6" mt={3} mb={2}>Order Lines</Typography>
                <IconButton color="primary" onClick={handleAddOrderLine}>
                    <AddIcon />
                </IconButton>
            </Box>
            {order.OrderLines.map((line, index) => (
                <Box key={index} mt={2} display="flex" alignItems="center">
                    <TextField
                        name="ItemNum"
                        value={line.ItemNum}
                        onChange={(e) => handleOrderLineChange(index, e)}
                        label="Item Number"
                        fullWidth
                        margin="normal"
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        name="ItemDescription"
                        value={line.ItemDescription}
                        onChange={(e) => handleOrderLineChange(index, e)}
                        label="Item Description"
                        fullWidth
                        margin="normal"
                        sx={{ mr: 2 }}
                    />
                    <IconButton
                        color="secondary"
                        onClick={() => handleRemoveOrderLine(index)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}


            <Box mt={4} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save Order
                </Button>
            </Box>
        </Layout>
    );
}
