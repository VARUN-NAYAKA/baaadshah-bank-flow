
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  return (
    <div className="overflow-x-auto">
      {transactions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b"
              >
                <TableCell className="font-medium">
                  {format(parseISO(transaction.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className={`text-right ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </TableCell>
              </motion.tr>
            ))}
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
