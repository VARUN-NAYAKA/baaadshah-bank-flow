
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-bank-primary">BAADSHAH</span>
              <span className="text-2xl font-bold text-bank-accent ml-1">BANK</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 text-bank-primary hover:text-bank-secondary font-medium transition-colors">Home</Link>
            <Link to="/about" className="px-3 py-2 text-bank-primary hover:text-bank-secondary font-medium transition-colors">About</Link>
            <Link to="/services" className="px-3 py-2 text-bank-primary hover:text-bank-secondary font-medium transition-colors">Services</Link>
            <Link to="/contact" className="px-3 py-2 text-bank-primary hover:text-bank-secondary font-medium transition-colors">Contact</Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <Link to="/login">
              <Button variant="outline" className="mr-3 border-bank-primary text-bank-primary hover:bg-bank-primary hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-bank-primary hover:bg-bank-secondary text-white">
                Register
              </Button>
            </Link>
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
              to="/"
              className="block px-3 py-2 text-base font-medium text-bank-primary hover:bg-gray-100 hover:text-bank-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about"
              className="block px-3 py-2 text-base font-medium text-bank-primary hover:bg-gray-100 hover:text-bank-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/services"
              className="block px-3 py-2 text-base font-medium text-bank-primary hover:bg-gray-100 hover:text-bank-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-bank-primary hover:bg-gray-100 hover:text-bank-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-3">
              <Link to="/login" className="w-1/2" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full border-bank-primary text-bank-primary">Login</Button>
              </Link>
              <Link to="/signup" className="w-1/2" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-bank-primary text-white">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
