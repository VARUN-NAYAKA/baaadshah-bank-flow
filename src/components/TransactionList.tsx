
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/services/authService";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit" | "transfer";
  sender?: {
    full_name: string;
    phone: string;
  };
  receiver?: {
    full_name: string;
    phone: string;
  };
}

interface TransactionListProps {
  transactions: Transaction[] | null;
  isLoading?: boolean;
}

const TransactionList = ({ transactions, isLoading = false }: TransactionListProps) => {
  const currentUser = getCurrentUser();
  console.log("Current transactions data:", transactions); // Debug log
  
  const getTransactionDetails = (transaction: Transaction) => {
    if (!currentUser) return { displayName: "", transactionType: "credit" };
    
    // Determine transaction type and display name based on sender/receiver
    if (transaction.type === 'transfer') {
      if (transaction.sender?.phone === currentUser.phone) {
        return {
          displayName: transaction.receiver?.full_name || transaction.receiver?.phone || 'Unknown',
          transactionType: 'debit'
        };
      } else {
        return {
          displayName: transaction.sender?.full_name || transaction.sender?.phone || 'Unknown',
          transactionType: 'credit'
        };
      }
    } else if (transaction.type === 'credit') {
      return {
        displayName: "Deposit",
        transactionType: 'credit'
      };
    } else {
      return {
        displayName: "Withdrawal",
        transactionType: 'debit'
      };
    }
  };
  
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
      {transactions && transactions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => {
              const { displayName, transactionType } = getTransactionDetails(transaction);
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(parseISO(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {transaction.description || "No description"}
                    {transaction.type === 'transfer' && (
                      <span className="text-xs text-gray-500 block">
                        {transactionType === 'credit' ? 'From: ' : 'To: '}{displayName}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={`text-right ${transactionType === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transactionType === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">No transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
