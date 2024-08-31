import { Fragment } from 'react';
import Link from 'next/link';
import Breadcrumb from './Breadcrumb';

export default function Layout({ children }) {
    return (
        <Fragment>
            <header>
                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/orders">Orders</Link>
                    <Link href="/customers">Customers</Link>
                    <Link href="/orders/create">Create Order</Link>
                </nav>
            </header>
            <Breadcrumb />
            <main>{children}</main>
        </Fragment>
    );
}
