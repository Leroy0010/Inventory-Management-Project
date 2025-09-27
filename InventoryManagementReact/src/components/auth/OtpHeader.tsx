import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';
interface OtpHeaderProps {
    email: string;
}

export default function OtpHeader({ email}: OtpHeaderProps) {
    return (
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">
                Two-Factor Authentication
            </CardTitle>
            <CardDescription>
                We've sent a 6-digit verification code to
                <br />
                <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
        </CardHeader>
    );
}
