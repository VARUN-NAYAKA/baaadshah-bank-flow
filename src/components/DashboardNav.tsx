
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronDown, 
  Home, 
  LogOut, 
  Menu, 
  User,
  Settings
} from "lucide-react";
import { logoutUser } from "@/services";
import { motion } from "framer-motion";

interface DashboardNavProps {
  name: string;
  accountNumber?: string;
}

const DashboardNav = ({ name, accountNumber }: DashboardNavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-bank-primary text-white">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">Baadshah Bank</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="flex items-center text-white hover:text-bank-accent transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
            
            <Link to="/profile/settings" className="flex items-center text-white hover:text-bank-accent transition-colors">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Link>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-bank-secondary">
                  <User className="h-4 w-4 mr-2" />
                  {name}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-default">
                  <div className="flex flex-col">
                    <span className="font-medium">{name}</span>
                    {accountNumber && (
                      <span className="text-xs text-gray-500">Acc: {accountNumber}</span>
                    )}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile/settings" className="flex items-center cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-2 mt-4 border-t border-bank-secondary"
          >
            <div className="flex flex-col space-y-3">
              <Link 
                to="/dashboard" 
                className="flex items-center py-2 px-1 text-white hover:text-bank-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              
              <Link 
                to="/profile/settings" 
                className="flex items-center py-2 px-1 text-white hover:text-bank-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                My Profile
              </Link>
              
              {accountNumber && (
                <div className="py-2 px-1 text-sm opacity-70">
                  Account: {accountNumber}
                </div>
              )}
              
              <button 
                onClick={handleLogout}
                className="flex items-center py-2 px-1 text-white hover:text-red-300 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default DashboardNav;
