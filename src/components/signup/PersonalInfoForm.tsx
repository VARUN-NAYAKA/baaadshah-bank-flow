
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

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
        onClick={handleNextStep}
        className="w-full bg-bank-primary hover:bg-bank-secondary text-white"
      >
        Next
      </Button>
    </motion.div>
  );
};

export default PersonalInfoForm;
