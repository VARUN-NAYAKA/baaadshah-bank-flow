
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

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
}

const Dashboard = () => {
  const [balance, setBalance] = useState(10000);
  const [accountNumber, setAccountNumber] = useState("896523471589632");
  const [name, setName] = useState("John Doe");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // Mock transaction data
  useEffect(() => {
    const mockTransactions = [
      {
        id: "tx1",
        date: "2023-05-01",
        description: "Salary deposit",
        amount: 5000,
        type: "credit" as const
      },
      {
        id: "tx2",
        date: "2023-05-02",
        description: "Grocery shopping",
        amount: 120.50,
        type: "debit" as const
      },
      {
        id: "tx3",
        date: "2023-05-03",
        description: "Transfer from Sarah",
        amount: 250,
        type: "credit" as const
      },
      {
        id: "tx4",
        date: "2023-05-04",
        description: "Utility bill payment",
        amount: 85.75,
        type: "debit" as const
      },
      {
        id: "tx5",
        date: "2023-05-05",
        description: "Online subscription",
        amount: 15.99,
        type: "debit" as const
      }
    ];
    
    setTransactions(mockTransactions);
  }, []);

  const handleTransfer = (recipientAccount: string, amount: number, description: string) => {
    if (amount > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: "You don't have enough balance to complete this transfer."
      });
      return false;
    }
    
    // Update balance
    setBalance(prevBalance => prevBalance - amount);
    
    // Add to transactions
    const newTransaction: Transaction = {
      id: `tx${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Transfer to ${recipientAccount} - ${description}`,
      amount: amount,
      type: "debit"
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    toast({
      title: "Transfer successful",
      description: `$${amount.toFixed(2)} has been sent to account ending in ${recipientAccount.slice(-4)}.`
    });
    
    return true;
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
                <div className="text-4xl font-bold mb-4">${balance.toFixed(2)}</div>
                <div className="flex space-x-3">
                  <Button variant="outline" className="text-xs border-white text-white hover:bg-white hover:text-bank-primary">
                    Add Money
                  </Button>
                  <Button className="text-xs bg-bank-accent text-bank-dark hover:bg-opacity-90">
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
                  <TransactionList transactions={transactions} />
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
                          <dt className="text-gray-500">Email</dt>
                          <dd>johndoe@example.com</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Phone</dt>
                          <dd>+1 (555) 123-4567</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Security Settings</h3>
                      <Separator className="my-2" />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Change Password</span>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Two-Factor Authentication</span>
                          <Button variant="outline" size="sm" className="bg-green-50 text-green-600 border-green-200">Enabled</Button>
                        </div>
                      </div>
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
