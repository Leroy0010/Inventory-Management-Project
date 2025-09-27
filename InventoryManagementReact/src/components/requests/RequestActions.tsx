import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';
import type { RequestResponseDto } from '@/types/request';

interface RequestActionsProps {
    request: RequestResponseDto;
    onApprove: () => void;
    onReject: () => void;
    isUpdating: boolean;
    hasPermission: boolean;
    hasFulfillmentPermission: boolean;
    onFulFill: () => void;
}

export function RequestActions({
    request,
    onApprove,
    onReject,
    onFulFill,
    isUpdating,
    hasPermission,
    hasFulfillmentPermission,
}: RequestActionsProps) {
    const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [isFulfillmentDialogOpen, setIsFulfillmentDialogOpen] =
        useState(false);
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    const handleApprove = () => {
        onApprove();
        setIsApprovalDialogOpen(false);
        setApprovalNotes('');
    };

    const handleReject = () => {
        onReject();
        setIsRejectionDialogOpen(false);
        setRejectionReason('');
    };

    const handleFulFil = () => {
        onFulFill();
        setIsFulfillmentDialogOpen(false);
    };

    if (
        !hasPermission ||
        !['PENDING', 'APPROVED'].includes(request.status) ||
        !hasFulfillmentPermission
    ) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {request.status === 'PENDING' && hasPermission && (
                    <>
                        <Dialog
                            open={isApprovalDialogOpen}
                            onOpenChange={setIsApprovalDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    className="w-full"
                                    variant="default"
                                    disabled={isUpdating}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve Request
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Approve Request</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to approve this
                                        request? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="approval-notes">
                                            Approval Notes (Optional)
                                        </Label>
                                        <Textarea
                                            id="approval-notes"
                                            value={approvalNotes}
                                            onChange={(e) =>
                                                setApprovalNotes(e.target.value)
                                            }
                                            placeholder="Add any notes about this approval..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setIsApprovalDialogOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleApprove}
                                        disabled={isUpdating}
                                    >
                                        Approve Request
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog
                            open={isRejectionDialogOpen}
                            onOpenChange={setIsRejectionDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    className="w-full"
                                    variant="destructive"
                                    disabled={isUpdating}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject Request
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Reject Request</DialogTitle>
                                    <DialogDescription>
                                        Please provide a reason for rejecting
                                        this request.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="rejection-reason">
                                            Rejection Reason
                                        </Label>
                                        <Textarea
                                            id="rejection-reason"
                                            value={rejectionReason}
                                            onChange={(e) =>
                                                setRejectionReason(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Please explain why this request is being rejected..."
                                            className="min-h-[100px]"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setIsRejectionDialogOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleReject}
                                        disabled={
                                            !rejectionReason.trim() ||
                                            isUpdating
                                        }
                                    >
                                        Reject Request
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )}

                {hasFulfillmentPermission && request.status === 'APPROVED' && (
                    <Dialog
                        open={isFulfillmentDialogOpen}
                        onOpenChange={setIsFulfillmentDialogOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                className="w-full"
                                variant="default"
                                disabled={isUpdating}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Fulfill Request
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Fulfill Request</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to fulfill this
                                    request? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            {/* <div className="space-y-4">
                                <div>
                                    <Label htmlFor="approval-notes">
                                        Approval Notes (Optional)
                                    </Label>
                                    <Textarea
                                        id="approval-notes"
                                        value={approvalNotes}
                                        onChange={(e) =>
                                            setApprovalNotes(e.target.value)
                                        }
                                        placeholder="Add any notes about this approval..."
                                        className="min-h-[100px]"
                                    />
                                </div>
                            </div> */}
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setIsFulfillmentDialogOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleFulFil}
                                    disabled={isUpdating}
                                >
                                    Fulfill Request
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>
        </Card>
    );
}
