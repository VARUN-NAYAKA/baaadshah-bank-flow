
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface TransferMoneyProps {
  onTransfer: (recipientPhone: string, amount: number, description: string) => Promise<boolean>;
}

const TransferMoney = ({ onTransfer }: TransferMoneyProps) => {
  const [recipientPhone, setRecipientPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimals
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientPhone || !amount || !description) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0."
      });
      return;
    }
    
    // Proceed to verification step
    setStep(2);
    
    // Simulate OTP sent to user's device
    toast({
      title: "Verification code sent",
      description: "A verification code has been sent to your registered mobile number."
    });
  };

  const handleVerifyAndTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid verification code",
        description: "Please enter a valid 6-digit verification code."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Perform the transfer
      const success = await onTransfer(recipientPhone, parseFloat(amount), description);
      
      if (success) {
        // Reset the form
        setRecipientPhone("");
        setAmount("");
        setDescription("");
        setOtp("");
        setStep(1);
      }
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientPhone">Recipient Phone Number</Label>
            <Input
              id="recipientPhone"
              placeholder="Enter recipient's phone number"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="input-field"
              required
            />
            <p className="text-xs text-gray-500">Enter with country code (e.g., +91XXXXXXXXXX)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={handleAmountChange}
              className="input-field"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What is this transfer for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-bank-primary hover:bg-bank-secondary text-white">
            Continue
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <Card className="bg-gray-50 p-4">
            <h3 className="font-medium mb-2">Transfer Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">To Phone:</span>
                <span className="font-medium">{recipientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">₹{parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Description:</span>
                <span className="font-medium">{description}</span>
              </div>
            </div>
          </Card>
          
          <form onSubmit={handleVerifyAndTransfer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-xl tracking-wider"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500">
                A 6-digit verification code has been sent to your registered mobile number.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-bank-primary hover:bg-bank-secondary text-white"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Complete Transfer"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
};

export default TransferMoney;
