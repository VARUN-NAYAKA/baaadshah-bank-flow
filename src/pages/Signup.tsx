import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import PersonalInfoForm from "@/components/signup/PersonalInfoForm";
import SecurityInfoForm from "@/components/signup/SecurityInfoForm";
import { registerUser } from "@/services";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
    address: "",
    username: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for password fields to ensure they are exactly 4 digits
    if ((name === 'password' || name === 'confirmPassword') && value.length <= 4) {
      // Only allow digits
      const onlyDigits = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: onlyDigits
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateStep1 = () => {
    // Validation handled in PersonalInfoForm component
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
        title: "PIN mismatch",
        description: "PINs don't match. Please try again."
      });
      return false;
    }
    
    if (formData.password.length !== 4 || !/^\d{4}$/.test(formData.password)) {
      toast({
        variant: "destructive",
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits."
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      // Register user in Supabase
      await registerUser({
        full_name: formData.fullName,
        username: formData.username,
        phone: formData.phone,
        age: parseInt(formData.age),
        address: formData.address,
        pin: formData.password
      });
      
      toast({
        title: "Account Created Successfully!",
        description: `Welcome to Baadshah Bank, ${formData.fullName}! Your account has been created successfully.`
      });
      
      // Navigate to login after a brief delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
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
                <PersonalInfoForm 
                  formData={formData}
                  updateFormData={updateFormData}
                  handleNextStep={handleNextStep}
                />
              ) : (
                <SecurityInfoForm 
                  formData={formData}
                  updateFormData={updateFormData}
                  handlePrevStep={handlePrevStep}
                  isLoading={isLoading}
                />
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
