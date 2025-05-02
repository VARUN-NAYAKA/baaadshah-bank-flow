
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-bank-primary text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span>BAADSHAH</span>
              <span className="text-bank-accent ml-1">BANK</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Secure, reliable banking services for all your financial needs. Trust in our experience and commitment to excellence.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-bank-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-bank-accent transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-bank-accent transition-colors">Our Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-bank-accent transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-bank-accent transition-colors">Money Transfer</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-bank-accent transition-colors">Savings Accounts</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-bank-accent transition-colors">Mobile Banking</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-bank-accent transition-colors">Loans</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Info</h4>
            <p className="text-gray-300 mb-2">
              123 Banking Street, Financial District
            </p>
            <p className="text-gray-300 mb-2">
              Phone: +1 (555) 123-4567
            </p>
            <p className="text-gray-300 mb-2">
              Email: info@baadshahbank.com
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Baadshah Bank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
