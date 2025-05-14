
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardNav from "@/components/DashboardNav";
import { toast } from "@/components/ui/use-toast";

// Imported components
import AccountOverview from "@/components/dashboard/AccountOverview";
import MessageDisplay from "@/components/dashboard/MessageDisplay";
import TransactionTabs from "@/components/dashboard/TransactionTabs";
import MoneyOperations from "@/components/dashboard/MoneyOperations";

// Imported services
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
  
  // Handle adding money - fixed return type to match the component props
  const handleAddMoney = async (amount: number, description: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await addMoneyToAccount(amount, description);
      
      setSuccess(`₹${amount.toFixed(2)} has been added to your account`);
      toast({
        title: "Success",
        description: `₹${amount.toFixed(2)} has been added to your account`,
        variant: "default"
      });
      
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (error: any) {
      console.error("Add money error:", error);
      setError(error.message || "Failed to add money to your account");
      toast({
        title: "Error",
        description: error.message || "Failed to add money to your account",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle withdrawing money - fixed return type to match the component props
  const handleWithdrawMoney = async (amount: number, description: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await withdrawMoneyFromAccount(amount, description);
      
      setSuccess(`₹${amount.toFixed(2)} has been withdrawn from your account`);
      toast({
        title: "Success",
        description: `₹${amount.toFixed(2)} has been withdrawn from your account`,
        variant: "default"
      });
      
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      setError(error.message || "Failed to withdraw money from your account");
      toast({
        title: "Error",
        description: error.message || "Failed to withdraw money from your account",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
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
          <AccountOverview user={user} account={account} />
          
          {/* Error and Success Messages */}
          <MessageDisplay error={error} success={success} />
          
          {/* Transaction Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions & History Tabs */}
            <TransactionTabs 
              transactions={transactions}
              transactionHistory={transactionHistory}
              isLoadingTransactions={isLoadingTransactions}
              isLoadingHistory={isLoadingHistory}
              onTabChange={handleTabChange}
              onRefresh={handleRefresh}
            />
            
            {/* Money Operations */}
            <MoneyOperations
              account={account}
              onAddMoney={handleAddMoney}
              onWithdrawMoney={handleWithdrawMoney}
              onTransferMoney={transferMoney}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
