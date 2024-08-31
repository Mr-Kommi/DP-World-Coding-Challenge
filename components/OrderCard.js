import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function OrderCard({ order }) {
    const router = useRouter();

    return (
        <Card
            onClick={() => router.push(`/orders/${order.ReferenceNum}`)}
            style={{ marginBottom: '20px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
            <CardContent>
                <Typography variant="h6">{order.ReferenceNum}</Typography>
                <Typography variant="body1">
                    Name: {order.Customer.FirstName} {order.Customer.LastName}
                </Typography>
                <Typography variant="body2">
                    Address: {order.Address.AddressLine1}, {order.Address.AddressLine2 || ''}, {order.Address.AddressType}
                </Typography>
                <Typography variant="body2">
                    Items: {order.OrderLines.length}
                </Typography>
            </CardContent>
        </Card>
    );
}
