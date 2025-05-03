
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DashboardNav from "@/components/DashboardNav";
import TransactionList from "@/components/TransactionList";
import TransferMoney from "@/components/TransferMoney";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  getCurrentUser, 
  getCurrentAccount,
  addMoney,
  withdrawMoney,
  getUserTransactions
} from "@/services/supabaseAuth";

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

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser();
    const account = getCurrentAccount();
    
    if (!user || !account) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "Please login to access your dashboard."
      });
      navigate("/login");
      return;
    }
    
    // Set user data
    setName(user.full_name);
    setPhone(user.phone);
    setBalance(account.balance);
    setAccountNumber(account.account_number);
    
    // Load transactions
    loadTransactions();
  }, [navigate, toast]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const userTransactions = await getUserTransactions();
      
      // Format transactions for display
      const formattedTransactions: Transaction[] = userTransactions.map((tx: any) => {
        const user = getCurrentUser();
        let type: "credit" | "debit" | "transfer" = tx.transaction_type;
        
        return {
          id: tx.id,
          date: tx.created_at,
          description: tx.description,
          amount: tx.amount,
          type,
          sender: tx.sender,
          receiver: tx.receiver
        };
      });
      
      setTransactions(formattedTransactions);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load transactions."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMoney = async () => {
    const amount = prompt("Enter amount to add:");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0."
      });
      return;
    }
    
    try {
      const { account } = await addMoney(Number(amount), "Deposit to account");
      
      setBalance(account.balance);
      
      toast({
        title: "Deposit successful",
        description: `₹${Number(amount).toFixed(2)} has been added to your account.`
      });
      
      // Refresh transactions
      loadTransactions();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add money."
      });
    }
  };

  const handleWithdraw = async () => {
    const amount = prompt("Enter amount to withdraw:");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0."
      });
      return;
    }
    
    try {
      const { account } = await withdrawMoney(Number(amount), "Withdrawal from account");
      
      setBalance(account.balance);
      
      toast({
        title: "Withdrawal successful",
        description: `₹${Number(amount).toFixed(2)} has been withdrawn from your account.`
      });
      
      // Refresh transactions
      loadTransactions();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to withdraw money."
      });
    }
  };

  const handleTransfer = async (recipientPhone: string, amount: number, description: string) => {
    if (amount > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "You don't have enough balance to complete this transfer."
      });
      return false;
    }
    
    try {
      // Transfer money using Supabase
      await transferMoney(recipientPhone, amount, description);
      
      // Update balance from account
      const account = getCurrentAccount();
      if (account) {
        setBalance(account.balance);
      }
      
      toast({
        title: "Transfer successful",
        description: `₹${amount.toFixed(2)} has been sent to ${recipientPhone}.`
      });
      
      // Refresh transactions
      loadTransactions();
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: error.message || "An unexpected error occurred"
      });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav accountNumber={accountNumber} name={name} />
      
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Welcome back, {name.split(' ')[0]}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-2 bg-gradient-to-r from-bank-primary to-bank-secondary text-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium opacity-80">Available Balance</CardTitle>
                <CardDescription className="text-white text-opacity-80">
                  Account: {accountNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{3})/, '$1 $2 $3 $4')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">₹{balance.toFixed(2)}</div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="text-xs border-white text-white hover:bg-white hover:text-bank-primary"
                    onClick={handleAddMoney}
                  >
                    Add Money
                  </Button>
                  <Button 
                    className="text-xs bg-bank-accent text-bank-dark hover:bg-opacity-90"
                    onClick={handleWithdraw}
                  >
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-bank-primary">Send Money</Button>
                <Button variant="outline" className="w-full border-bank-primary text-bank-primary">
                  Pay Bills
                </Button>
                <Button variant="outline" className="w-full border-bank-primary text-bank-primary">
                  Mobile Recharge
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="transactions">
            <TabsList className="mb-6">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="transfer">Transfer Money</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>View your recent account activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList transactions={transactions} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transfer">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Money</CardTitle>
                  <CardDescription>Send money to other accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransferMoney onTransfer={handleTransfer} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Personal Information</h3>
                      <Separator className="my-2" />
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Full Name</dt>
                          <dd>{name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Account Number</dt>
                          <dd>{accountNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{3})/, '$1 $2 $3 $4')}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Phone</dt>
                          <dd>{phone}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
