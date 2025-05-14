
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCw } from "lucide-react";
import AddMoneyForm from "./AddMoneyForm";
import WithdrawMoneyForm from "./WithdrawMoneyForm";
import TransferMoney from "@/components/TransferMoney";
import { Account } from "@/services";

interface MoneyOperationsProps {
  account: Account;
  onAddMoney: (amount: number, description: string) => Promise<boolean>;
  onWithdrawMoney: (amount: number, description: string) => Promise<boolean>;
  onTransferMoney: (recipientPhone: string, amount: number, description: string) => Promise<boolean>;
}

const MoneyOperations = ({ 
  account, 
  onAddMoney, 
  onWithdrawMoney, 
  onTransferMoney 
}: MoneyOperationsProps) => {
  return (
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
            <AddMoneyForm onAddMoney={onAddMoney} />
          </TabsContent>
          
          {/* Withdraw Money Tab */}
          <TabsContent value="withdraw" className="space-y-4">
            <WithdrawMoneyForm 
              account={account} 
              onWithdrawMoney={onWithdrawMoney} 
            />
          </TabsContent>
          
          {/* Transfer Money Tab */}
          <TabsContent value="transfer">
            <h3 className="font-semibold flex items-center mb-4">
              <RotateCw className="h-4 w-4 text-blue-600 mr-2" />
              Transfer Money
            </h3>
            <TransferMoney onTransfer={onTransferMoney} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MoneyOperations;
