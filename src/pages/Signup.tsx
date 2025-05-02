
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
    address: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.age) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return false;
    }
    
    if (parseInt(formData.age) < 18) {
      toast({
        variant: "destructive",
        title: "Age restriction",
        description: "You must be at least 18 years old to create an account."
      });
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword || !formData.address) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords don't match. Please try again."
      });
      return false;
    }
    
    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 8 characters long."
      });
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    // Simulate API call for creating an account
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate a random 15-digit account number
      const accountNumber = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
      
      toast({
        title: "Account Created Successfully!",
        description: `Your account number is ${accountNumber}. Please save this for future reference.`
      });
      
      // Navigate to login after a brief delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-t-4 border-t-bank-primary">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              <span className="text-bank-primary">BAADSHAH</span>
              <span className="text-bank-accent"> BANK</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Create your account today
            </CardDescription>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <div className={`w-10 h-2 rounded ${currentStep === 1 ? 'bg-bank-primary' : 'bg-gray-300'}`}></div>
              <div className={`w-10 h-2 rounded ${currentStep === 2 ? 'bg-bank-primary' : 'bg-gray-300'}`}></div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 ? (
                // Step 1: Personal Information
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
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
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
              ) : (
                // Step 2: Security Information
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={updateFormData}
                      required
                      className="input-field"
                    />
                    <p className="text-xs text-gray-500">Password must be at least 8 characters long.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
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
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-bank-secondary hover:text-bank-primary underline">
                Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
