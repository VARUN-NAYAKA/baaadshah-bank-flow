
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { checkPhoneExists } from "@/services";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfoFormProps {
  formData: {
    fullName: string;
    phone: string;
    age: string;
    username: string;
  };
  updateFormData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
}

const PersonalInfoForm = ({ formData, updateFormData, handleNextStep }: PersonalInfoFormProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleNext = async () => {
    // Validate form data
    if (!formData.fullName || !formData.username || !formData.phone || !formData.age) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    if (parseInt(formData.age) < 18) {
      toast({
        variant: "destructive",
        title: "Age restriction",
        description: "You must be at least 18 years old to create an account."
      });
      return;
    }
    
    // Check if phone number already exists
    setIsChecking(true);
    try {
      const exists = await checkPhoneExists(formData.phone);
      if (exists) {
        toast({
          variant: "destructive",
          title: "Phone number already registered",
          description: "This phone number is already associated with an account."
        });
        setIsChecking(false);
        return;
      }
      
      // All validations passed, proceed to next step
      handleNextStep();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred while checking the phone number."
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={updateFormData}
          required
          className="input-field"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={updateFormData}
          required
          className="input-field"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={updateFormData}
          required
          className="input-field"
        />
        <p className="text-xs text-gray-500">Enter with country code (e.g., +91XXXXXXXXXX)</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          name="age"
          type="number"
          placeholder="Enter your age"
          value={formData.age}
          onChange={updateFormData}
          min="18"
          required
          className="input-field"
        />
        <p className="text-xs text-gray-500">You must be at least 18 years old.</p>
      </div>
      
      <Button
        type="button"
        onClick={handleNext}
        className="w-full bg-bank-primary hover:bg-bank-secondary text-white"
        disabled={isChecking}
      >
        {isChecking ? "Checking..." : "Next"}
      </Button>
    </motion.div>
  );
};

export default PersonalInfoForm;
