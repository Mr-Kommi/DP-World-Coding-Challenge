import { useEffect, useState } from 'react';
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
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

export default function EditOrder() {
    const router = useRouter();
    const { referenceNum } = router.query;
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (referenceNum) {
            const fetchOrder = async () => {
                try {
                    const response = await axiosInstance.get(`/orders/${referenceNum}`);
                    setOrder(response.data.order);
                } catch (error) {
                    console.error('Failed to fetch order:', error);
                    setError('Failed to load order details.');
                }
            };

            fetchOrder();
        }
    }, [referenceNum]);

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
            await axiosInstance.put(`/orders/${referenceNum}`, order);
            alert('Order updated successfully!');
            setIsEditing(false);
            router.push(`/orders/${referenceNum}`);
        } catch (error) {
            console.error('Failed to update order:', error);
            setError('Failed to update order. Please try again.');
        }
    };

    const renderField = (label, value) => (
        <Box mb={2}>
            <Typography variant="subtitle1">{label}</Typography>
            <Typography variant="body1">{value}</Typography>
        </Box>
    );

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>{isEditing && "Edit"} Order {referenceNum}</Typography>
            {error && <Alert severity="error">{error}</Alert>}

            {order ? (
                <>
                    <Divider />
                    <Typography variant="h6" mt={3} mb={2}>Customer Information</Typography>
                    <Box>
                        {isEditing ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                {renderField("Customer Code", order.Customer.CustomerCode)}
                                {renderField("First Name", order.Customer.FirstName)}
                                {renderField("Last Name", order.Customer.LastName)}
                                {renderField("Phone", order.Customer.Phone)}
                                {renderField("Email", order.Customer.Email)}
                            </>
                        )}
                    </Box>

                    <Divider />
                    <Typography variant="h6" mt={3} mb={2}>Address Information</Typography>
                    <Box>
                        {isEditing ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                {renderField("Country Code", order.CountryCode)}
                                {renderField("Full Name", order.Address.FullName)}
                                {renderField("Address Type", order.Address.AddressType)}
                                {renderField("Address Line 1", order.Address.AddressLine1)}
                                {renderField("Address Line 2", order.Address.AddressLine2)}
                            </>
                        )}
                    </Box>

                    <Divider />
                    <Typography variant="h6" mt={3} mb={2}>Order Lines</Typography>
                    {order.OrderLines.map((line, index) => (
                        <Box key={index} mt={2} display="flex" alignItems="center">
                            {isEditing ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    {renderField("Item Number", line.ItemNum)}
                                    {renderField("Item Description", line.ItemDescription)}
                                </>
                            )}
                        </Box>
                    ))}
                    {isEditing && (
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <IconButton color="primary" onClick={handleAddOrderLine}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    )}

                    <Box mt={4} display="flex" justifyContent="flex-end">
                        {isEditing ? (
                            <Button variant="contained" color="primary" onClick={handleSave}>
                                Save Order
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                                Edit Order
                            </Button>
                        )}
                    </Box>
                </>
            ) : (
                <Typography variant="h6">Loading...</Typography>
            )}
        </Layout>
    );
}
