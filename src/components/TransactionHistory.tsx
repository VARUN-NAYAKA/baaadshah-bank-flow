
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionHistoryItem {
  id: string;
  transaction_id: string;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string | null;
  date: string;
  status: string;
}

interface TransactionHistoryProps {
  history: TransactionHistoryItem[] | null;
  isLoading?: boolean;
}

const TransactionHistory = ({ history, isLoading = false }: TransactionHistoryProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      {history && history.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Balance Before</TableHead>
              <TableHead className="text-right">Balance After</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {format(parseISO(item.date), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.transaction_type === 'credit' ? 'bg-green-100 text-green-800' : 
                    item.transaction_type === 'debit' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.transaction_type}
                  </span>
                </TableCell>
                <TableCell>{item.description || "No description"}</TableCell>
                <TableCell className={`text-right ${
                  item.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.transaction_type === 'credit' ? '+' : '-'}₹{item.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">₹{item.balance_before.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium">₹{item.balance_after.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">No transaction history found.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
