
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { User, Account } from "@/services";

interface AccountOverviewProps {
  user: User;
  account: Account;
}

const AccountOverview = ({ user, account }: AccountOverviewProps) => {
  return (
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
  );
};

export default AccountOverview;
