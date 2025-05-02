
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardNavProps {
  name: string;
  accountNumber: string;
}

const DashboardNav = ({ name, accountNumber }: DashboardNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Handle logout logic here
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-bank-primary">BAADSHAH</span>
              <span className="text-2xl font-bold text-bank-accent ml-1">BANK</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/dashboard" className="px-3 py-2 text-bank-primary hover:text-bank-secondary font-medium transition-colors">Dashboard</Link>
            <Link to="/transactions" className="px-3 py-2 text-bank-primary hover:text-bank-secondary font-medium transition-colors">Transactions</Link>
            <Link to="/cards" className="px-3 py-2 text-bank-primary hover:text-bank-secondary font-medium transition-colors">Cards</Link>
            <Link to="/support" className="px-3 py-2 text-bank-primary hover:text-bank-secondary font-medium transition-colors">Support</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-bank-primary text-white rounded-full flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gray-500">Account: ...{accountNumber.slice(-4)}</div>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="text-sm text-gray-500">
                Logout
              </Button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center"
              aria-label="Main menu"
              aria-expanded="false"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/dashboard"
              className="block px-3 py-2 text-base font-medium text-bank-primary hover:bg-gray-100 hover:text-bank-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/transactions"
              className="block px-3 py-2 text-base font-medium text-bank-primary hover:bg-gray-100 hover:text-bank-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Transactions
            </Link>
            <Link 
              to="/cards"
              className="block px-3 py-2 text-base font-medium text-bank-primary hover:bg-gray-100 hover:text-bank-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Cards
            </Link>
            <Link 
              to="/support"
              className="block px-3 py-2 text-base font-medium text-bank-primary hover:bg-gray-100 hover:text-bank-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="h-10 w-10 bg-bank-primary text-white rounded-full flex items-center justify-center mr-3">
                <User className="h-6 w-6" />
              </div>
              <div>
                <div className="text-base font-medium">{name}</div>
                <div className="text-sm text-gray-500">Account: ...{accountNumber.slice(-4)}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNav;
