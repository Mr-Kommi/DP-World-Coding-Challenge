import Layout from '@/components/Layout';
import { Box, Link, Typography } from '@mui/material';

export default function Home() {

    return (
        <Layout>
            <Typography variant="h4" color={"primary"}>
                Welcome to DP World Coding Challenge
            </Typography>
            <Typography variant="h5" mt={3}>
                Thanks for the opportunity !!
            </Typography>
            <Typography variant="h6" mt={3}>
                Download Sample XML Files
            </Typography>
            <Box >
                <ul>
                    <li>
                        <Link href="/sample/order1.xml" download>
                            Order Sample 1
                        </Link>
                    </li>
                    <li>
                        <Link href="/sample/order2.xml" download>
                            Order Sample 2
                        </Link>
                    </li>
                    <li>
                        <Link href="/sample/order3.xml" download>
                            Order Sample 3
                        </Link>
                    </li>
                    <li>
                        <Link href="/sample/order4.xml" download>
                            Order Sample 4
                        </Link>
                    </li>
                </ul>
            </Box>
        </Layout>
    );
}
