
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AddMoneyFormProps {
  onAddMoney: (amount: number, description: string) => Promise<boolean>;
}

const AddMoneyForm = ({ onAddMoney }: AddMoneyFormProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive"
      });
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await onAddMoney(parsedAmount, description);
      if (success) {
        setAmount("");
        setDescription("");
      }
    } catch (error) {
      console.error("Add money form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Description (Optional)</label>
          <Input 
            placeholder="What is this for?" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button 
          className="w-full bg-bank-primary hover:bg-bank-secondary text-white" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Add Money"}
        </Button>
      </div>
    </div>
  );
};

export default AddMoneyForm;
