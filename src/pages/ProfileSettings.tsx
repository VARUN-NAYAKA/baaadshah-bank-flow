
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, UserCircle, KeyRound, Phone } from "lucide-react";
import { getCurrentUser, updateUserProfile, updateUserPin, updateUserPhone } from "@/services";
import { motion } from "framer-motion";
import DashboardNav from "@/components/DashboardNav";
import { getCurrentAccount } from "@/services";

const ProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    username: "",
    age: "",
    currentPin: "",
    newPin: "",
    confirmPin: "",
    currentPhone: "",
    newPhone: "",
    confirmPhone: ""
  });
  
  const navigate = useNavigate();
  
  // Load user data
  useEffect(() => {
    const currentUser = getCurrentUser();
    const currentAccount = getCurrentAccount();
    
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    setUser(currentUser);
    setAccount(currentAccount);
    
    // Initialize form data with user info
    setFormData(prev => ({
      ...prev,
      fullName: currentUser.fullName || "",
      address: currentUser.address || "",
      username: currentUser.username || "",
      age: currentUser.age?.toString() || "",
      currentPhone: currentUser.phone || ""
    }));
    
  }, [navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user is typing
    setError(null);
    setSuccess(null);
  };
  
  // Update profile information
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!user) return;
      
      await updateUserProfile({
        id: user.id,
        fullName: formData.fullName,
        address: formData.address,
        username: formData.username,
        age: parseInt(formData.age) || user.age
      });
      
      setSuccess("Profile updated successfully");
      
      // Update local user data
      const updatedUser = {
        ...user,
        fullName: formData.fullName,
        address: formData.address,
        username: formData.username,
        age: parseInt(formData.age) || user.age
      };
      
      setUser(updatedUser);
      
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update PIN
  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!user) return;
      
      // Validate PIN
      if (formData.currentPin !== user.pin) {
        setError("Current PIN is incorrect");
        setIsLoading(false);
        return;
      }
      
      if (formData.newPin.length !== 4 || !/^\d+$/.test(formData.newPin)) {
        setError("PIN must be exactly 4 digits");
        setIsLoading(false);
        return;
      }
      
      if (formData.newPin !== formData.confirmPin) {
        setError("New PINs don't match");
        setIsLoading(false);
        return;
      }
      
      await updateUserPin(user.id, formData.newPin);
      
      setSuccess("PIN updated successfully");
      
      // Update local user data
      const updatedUser = {
        ...user,
        pin: formData.newPin
      };
      
      setUser(updatedUser);
      
      // Clear PIN fields
      setFormData(prev => ({
        ...prev,
        currentPin: "",
        newPin: "",
        confirmPin: ""
      }));
      
    } catch (error: any) {
      setError(error.message || "Failed to update PIN");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update phone number
  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!user) return;
      
      // Validate phone
      if (formData.newPhone !== formData.confirmPhone) {
        setError("New phone numbers don't match");
        setIsLoading(false);
        return;
      }
      
      if (formData.newPhone === user.phone) {
        setError("New phone number is the same as current one");
        setIsLoading(false);
        return;
      }
      
      await updateUserPhone(user.id, formData.newPhone);
      
      setSuccess("Phone number updated successfully");
      
      // Update local user data
      const updatedUser = {
        ...user,
        phone: formData.newPhone
      };
      
      setUser(updatedUser);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        currentPhone: formData.newPhone,
        newPhone: "",
        confirmPhone: ""
      }));
      
    } catch (error: any) {
      setError(error.message || "Failed to update phone number");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav name={user.fullName} accountNumber={account?.account_number} />
      
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">My Profile Settings</CardTitle>
              <CardDescription>Update your personal information and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert variant="default" className="mb-6 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="profile"><UserCircle className="h-4 w-4 mr-2" />Profile</TabsTrigger>
                  <TabsTrigger value="pin"><KeyRound className="h-4 w-4 mr-2" />Change PIN</TabsTrigger>
                  <TabsTrigger value="phone"><Phone className="h-4 w-4 mr-2" />Change Phone</TabsTrigger>
                </TabsList>
                
                {/* Profile Information */}
                <TabsContent value="profile">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Your username"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="Your age"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Your address"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-bank-primary hover:bg-bank-secondary text-white w-full md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Save Changes"}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Change PIN */}
                <TabsContent value="pin">
                  <form onSubmit={handleUpdatePin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPin">Current PIN</Label>
                      <Input
                        id="currentPin"
                        name="currentPin"
                        type="password"
                        value={formData.currentPin}
                        onChange={handleInputChange}
                        placeholder="Enter current PIN"
                        maxLength={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPin">New PIN</Label>
                        <Input
                          id="newPin"
                          name="newPin"
                          type="password"
                          value={formData.newPin}
                          onChange={handleInputChange}
                          placeholder="Enter new 4-digit PIN"
                          maxLength={4}
                        />
                        <p className="text-xs text-gray-500">PIN must be exactly 4 digits</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPin">Confirm New PIN</Label>
                        <Input
                          id="confirmPin"
                          name="confirmPin"
                          type="password"
                          value={formData.confirmPin}
                          onChange={handleInputChange}
                          placeholder="Confirm new PIN"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-bank-primary hover:bg-bank-secondary text-white w-full md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update PIN"}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Change Phone */}
                <TabsContent value="phone">
                  <form onSubmit={handleUpdatePhone} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPhone">Current Phone Number</Label>
                      <Input
                        id="currentPhone"
                        value={formData.currentPhone}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPhone">New Phone Number</Label>
                        <Input
                          id="newPhone"
                          name="newPhone"
                          value={formData.newPhone}
                          onChange={handleInputChange}
                          placeholder="Enter new phone number"
                        />
                        <p className="text-xs text-gray-500">Include country code (e.g., +91XXXXXXXXXX)</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPhone">Confirm New Phone</Label>
                        <Input
                          id="confirmPhone"
                          name="confirmPhone"
                          value={formData.confirmPhone}
                          onChange={handleInputChange}
                          placeholder="Confirm new phone number"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-bank-primary hover:bg-bank-secondary text-white w-full md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Phone Number"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;
