
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/TransactionList";
import TransactionHistory from "@/components/TransactionHistory";

interface TransactionTabsProps {
  transactions: any[] | null;
  transactionHistory: any[] | null;
  isLoadingTransactions: boolean;
  isLoadingHistory: boolean;
  onTabChange: (value: string) => void;
  onRefresh: () => void;
}

const TransactionTabs = ({
  transactions,
  transactionHistory,
  isLoadingTransactions,
  isLoadingHistory,
  onTabChange,
  onRefresh
}: TransactionTabsProps) => {
  return (
    <Card className="shadow-md lg:col-span-2 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 pb-3 flex items-center justify-between">
          <Tabs defaultValue="transactions" className="w-full" onValueChange={onTabChange}>
            <TabsList>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            <div className="mt-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
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
  );
};

export default TransactionTabs;
