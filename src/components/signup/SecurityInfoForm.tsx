
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface SecurityInfoFormProps {
  formData: {
    address: string;
    password: string;
    confirmPassword: string;
  };
  updateFormData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePrevStep: () => void;
  isLoading: boolean;
}

const SecurityInfoForm = ({ formData, updateFormData, handlePrevStep, isLoading }: SecurityInfoFormProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={updateFormData}
          required
          className="input-field"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">PIN (4 digits)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          placeholder="Create a 4-digit PIN"
          value={formData.password}
          onChange={updateFormData}
          required
          className="input-field"
        />
        <p className="text-xs text-gray-500">PIN must be exactly 4 digits.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm PIN</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          placeholder="Confirm your PIN"
          value={formData.confirmPassword}
          onChange={updateFormData}
          required
          className="input-field"
        />
      </div>
      
      <div className="flex space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevStep}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-bank-primary hover:bg-bank-secondary text-white"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </motion.div>
  );
};

export default SecurityInfoForm;
