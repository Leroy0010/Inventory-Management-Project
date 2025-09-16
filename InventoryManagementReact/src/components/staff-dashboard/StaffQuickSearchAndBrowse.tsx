import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { FileText, Package, Search, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export default function StaffQuickSearchAndBrowse() {
    const navigate = useNavigate()
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Quick Search & Browse
                </CardTitle>
                <CardDescription>
                    Find items quickly and start shopping
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => navigate('/inventory-items')}
                    >
                        <Package className="h-6 w-6" />
                        <span className="font-medium">Browse All Items</span>
                        <span className="text-xs text-gray-500">
                            View complete inventory
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() =>
                            navigate(
                                '/inventory-items?category=office-supplies'
                            )
                        }
                    >
                        <FileText className="h-6 w-6" />
                        <span className="font-medium">Office Supplies</span>
                        <span className="text-xs text-gray-500">
                            Pens, papers, notebooks
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() =>
                            navigate('/inventory?category=it-equipment')
                        }
                    >
                        <TrendingUp className="h-6 w-6" />
                        <span className="font-medium">IT Equipment</span>
                        <span className="text-xs text-gray-500">
                            Computers, accessories
                        </span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
