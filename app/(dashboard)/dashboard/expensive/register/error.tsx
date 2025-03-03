"use client"
import { NextPage } from 'next';
import Link from 'next/link';

const ErrorPage: NextPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Something went wrong</h1>
            <p>We are sorry, but an unexpected error has occurred.</p>
            <Link href="/dashboard">
                <a>Go back to Dashboard</a>
            </Link>
        </div>
    );
};

export default ErrorPage;