
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { login } from "@/services/localAuth";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Login with our local auth service
      const user = login({
        phone: phone,
        password: password,
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.fullName}!`,
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
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
              Login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="input-field"
                />
                <p className="text-xs text-gray-500">Enter with country code (e.g., +91XXXXXXXXXX)</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">PIN</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  placeholder="Enter your 4-digit PIN"
                  value={password}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, '');
                    if (onlyDigits.length <= 4) {
                      setPassword(onlyDigits);
                    }
                  }}
                  required
                  className="input-field"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-bank-primary hover:bg-bank-secondary text-white"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-bank-secondary hover:text-bank-primary underline">
                Sign up now
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
