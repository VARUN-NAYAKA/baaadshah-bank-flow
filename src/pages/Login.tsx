
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Show 2FA code verification for demo purposes
      // In a real app, this would check credentials first
      if (email && password) {
        setShowVerification(true);
        toast({
          title: "Verification code sent",
          description: "Please check your email or phone for the code.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Please enter both email and password.",
        });
      }
    }, 1500);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API verification
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo, any 6-digit code works
      if (verificationCode.length === 6) {
        toast({
          title: "Login successful",
          description: "Welcome to Baadshah Bank!",
        });
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "Please enter a valid 6-digit code.",
        });
      }
    }, 1500);
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
              {showVerification ? "Enter verification code" : "Login to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showVerification ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password"
                      className="text-sm font-medium text-bank-secondary hover:text-bank-primary"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="input-field text-center text-lg tracking-wider"
                    inputMode="numeric"
                    maxLength={6}
                  />
                  <p className="text-sm text-gray-500 text-center mt-2">
                    A verification code has been sent to your registered email or phone number
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-bank-primary hover:bg-bank-secondary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowVerification(false)}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </form>
            )}
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
