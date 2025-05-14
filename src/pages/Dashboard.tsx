
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardNav from "@/components/DashboardNav";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, RotateCw, RefreshCw, AlertCircle, CheckCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TransferMoney from "@/components/TransferMoney";
import TransactionList from "@/components/TransactionList";
import TransactionHistory from "@/components/TransactionHistory";
import { toast } from "@/components/ui/use-toast";
import { 
  getCurrentUser,
  getCurrentAccount,
  getUserTransactions,
  getAccountTransactionHistory,
  addMoneyToAccount,
  withdrawMoneyFromAccount,
  transferMoney,
  User,
  Account
} from "@/services";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<any[] | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<any[] | null>(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("transactions");
  const navigate = useNavigate();
  
  // Refresh data when refresh button is clicked or after operations
  const refreshData = async () => {
    setIsLoadingTransactions(true);
    setError(null);
    try {
      // Check if user is logged in
      const currentUser = getCurrentUser();
      const currentAccount = getCurrentAccount();
      
      if (!currentUser || !currentAccount) {
        navigate("/login");
        return;
      }
      
      setUser(currentUser);
      setAccount(currentAccount);
      
      // Get transactions
      const userTransactions = await getUserTransactions();
      setTransactions(userTransactions || []);
      console.log("Transactions set:", userTransactions);
      
      // Get transaction history if active tab is history
      if (activeTab === "history" && currentAccount) {
        await fetchTransactionHistory(currentAccount.id);
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      setError(error.message || "Failed to load account data");
      toast({
        title: "Error",
        description: error.message || "Failed to load account data",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };
  
  // Fetch transaction history for an account
  const fetchTransactionHistory = async (accountId: string) => {
    setIsLoadingHistory(true);
    try {
      const history = await getAccountTransactionHistory(accountId);
      setTransactionHistory(history || []);
      console.log("Transaction history set:", history);
    } catch (error: any) {
      console.error("Error loading transaction history:", error);
      setError(error.message || "Failed to load transaction history");
      toast({
        title: "Error",
        description: error.message || "Failed to load transaction history",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };
  
  // Check if user is logged in on component mount
  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);
  
  // Load transaction history when tab changes
  useEffect(() => {
    if (activeTab === "history" && account) {
      fetchTransactionHistory(account.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, account]);
  
  // Handle adding money
  const handleAddMoney = async () => {
    if (!addAmount) {
      setError("Please enter an amount");
      return;
    }
    
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await addMoneyToAccount(amount, addDescription);
      
      setSuccess(`₹${amount.toFixed(2)} has been added to your account`);
      toast({
        title: "Success",
        description: `₹${amount.toFixed(2)} has been added to your account`,
        variant: "default"
      });
      
      // Clear form
      setAddAmount("");
      setAddDescription("");
      
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error("Add money error:", error);
      setError(error.message || "Failed to add money to your account");
      toast({
        title: "Error",
        description: error.message || "Failed to add money to your account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle withdrawing money
  const handleWithdrawMoney = async () => {
    if (!withdrawAmount) {
      setError("Please enter an amount");
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }
    
    if (account && amount > account.balance) {
      setError("Insufficient balance for this withdrawal");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await withdrawMoneyFromAccount(amount, withdrawDescription);
      
      setSuccess(`₹${amount.toFixed(2)} has been withdrawn from your account`);
      toast({
        title: "Success",
        description: `₹${amount.toFixed(2)} has been withdrawn from your account`,
        variant: "default"
      });
      
      // Clear form
      setWithdrawAmount("");
      setWithdrawDescription("");
      
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      setError(error.message || "Failed to withdraw money from your account");
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw money from your account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle transferring money
  const handleTransferMoney = async (recipientPhone: string, amount: number, description: string = "") => {
    if (user && recipientPhone === user.phone) {
      setError("You cannot transfer money to your own account");
      return false;
    }
    
    try {
      await transferMoney(recipientPhone, amount, description);
      
      setSuccess(`₹${amount.toFixed(2)} has been transferred successfully`);
      toast({
        title: "Success",
        description: `₹${amount.toFixed(2)} has been transferred successfully`,
        variant: "default"
      });
      
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
      
      return true;
    } catch (error: any) {
      console.error("Transfer error:", error);
      setError(error.message || "Failed to transfer money");
      toast({
        title: "Error",
        description: error.message || "Failed to transfer money",
        variant: "destructive"
      });
      return false;
    }
  };

  // If user is not logged in, redirect to login page
  if (!user || !account) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav name={user.fullName} accountNumber={account.account_number} />
      
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Account Overview Card */}
          <Card className="shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.fullName}</h2>
                  <p className="text-gray-500">Account: {account.account_number}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-3xl font-bold text-bank-primary">₹{account.balance.toFixed(2)}</div>
                  <p className="text-gray-500">Current Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Error and Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {/* Transaction Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions & History Tabs */}
            <Card className="shadow-md lg:col-span-2 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 pb-3 flex items-center justify-between">
                  <Tabs defaultValue="transactions" className="w-full" onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                      <TabsTrigger value="history">Transaction History</TabsTrigger>
                    </TabsList>
                    <div className="mt-2 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setRefreshTrigger(prev => prev + 1)}
                        disabled={isLoadingTransactions || isLoadingHistory}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                      </Button>
                    </div>
                    
                    <TabsContent value="transactions" className="pt-2">
                      <TransactionList transactions={transactions} isLoading={isLoadingTransactions} />
                    </TabsContent>
                    
                    <TabsContent value="history" className="pt-2">
                      <TransactionHistory history={transactionHistory} isLoading={isLoadingHistory} />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
            
            {/* Money Operations */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <Tabs defaultValue="add">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="add">Add</TabsTrigger>
                    <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                    <TabsTrigger value="transfer">Transfer</TabsTrigger>
                  </TabsList>
                  
                  {/* Add Money Tab */}
                  <TabsContent value="add" className="space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <ArrowDown className="h-4 w-4 text-green-600 mr-2" />
                      Add Money
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium block mb-1">Amount (₹) *</label>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          value={addAmount} 
                          onChange={(e) => setAddAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Description (Optional)</label>
                        <Input 
                          placeholder="What is this for?" 
                          value={addDescription} 
                          onChange={(e) => setAddDescription(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full bg-bank-primary hover:bg-bank-secondary text-white" 
                        onClick={handleAddMoney}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Add Money"}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* Withdraw Money Tab */}
                  <TabsContent value="withdraw" className="space-y-4">
                    <h3 className="font-semibold flex items-center">
                      <ArrowUp className="h-4 w-4 text-red-600 mr-2" />
                      Withdraw Money
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium block mb-1">Amount (₹) *</label>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          value={withdrawAmount} 
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Description (Optional)</label>
                        <Input 
                          placeholder="What is this for?" 
                          value={withdrawDescription} 
                          onChange={(e) => setWithdrawDescription(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full bg-bank-primary hover:bg-bank-secondary text-white" 
                        onClick={handleWithdrawMoney}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Withdraw Money"}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  {/* Transfer Money Tab */}
                  <TabsContent value="transfer">
                    <h3 className="font-semibold flex items-center mb-4">
                      <RotateCw className="h-4 w-4 text-blue-600 mr-2" />
                      Transfer Money
                    </h3>
                    <TransferMoney onTransfer={handleTransferMoney} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
