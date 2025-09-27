import { Label } from '../ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import type { UseMutationResult } from '@tanstack/react-query';

interface OtpInputProps {
    otp: string;
    setOtp: React.Dispatch<React.SetStateAction<string>>;
    verify2FAMutation: UseMutationResult<any, Error, any, unknown>;
}

export default function OtpInput({
    otp,
    setOtp,
    verify2FAMutation,
}: OtpInputProps) {
    return (
        <div className="space-y-4">
            <Label htmlFor="otp" className="text-center block">
                Enter verification code
            </Label>

            <div className="flex justify-center">
                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    disabled={verify2FAMutation.isPending}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
        </div>
    );
}
