import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon, CreditCard, SendIcon, DownloadIcon, LockIcon } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <SendIcon className="h-10 w-10 text-bank-primary" />,
      title: "Easy Money Transfer",
      description: "Send money to anyone, anywhere with just a few clicks."
    },
    {
      icon: <DownloadIcon className="h-10 w-10 text-bank-primary" />,
      title: "Instant Deposits",
      description: "Receive funds instantly from other Baadshah Bank accounts."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-bank-primary" />,
      title: "Digital Banking",
      description: "Access your account anytime, anywhere from any device."
    },
    {
      icon: <LockIcon className="h-10 w-10 text-bank-primary" />,
      title: "Secure Authentication",
      description: "Multi-factor authentication to keep your money safe."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-bank-primary to-bank-secondary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Banking Made <span className="text-bank-accent">Simple</span> and Secure
                </h1>
                <p className="text-xl mb-8 max-w-lg">
                  Experience the next generation of banking with Baadshah Bank. Secure, reliable, and always available.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <Button size="lg" className="bg-bank-accent text-bank-dark hover:bg-opacity-90 font-bold text-lg">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-bank-primary font-semibold text-lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" 
                  alt="Banking App" 
                  className="w-full h-64 object-cover object-center"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-bank-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-bank-primary mb-4">Why Choose Baadshah Bank?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our modern banking solutions are designed to make your financial life easier, safer and more rewarding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-blue-50 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-bank-primary">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-bank-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to experience better banking?</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have made the switch to Baadshah Bank. Open your account in minutes!
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-bank-accent text-bank-dark hover:bg-opacity-90 font-bold px-8 py-6 text-lg">
                Open an Account Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-100 p-1 rounded-lg shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Mobile Banking" 
                  className="rounded-lg"
                />
              </motion.div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6 text-bank-primary">The Banking Experience You Deserve</h2>
                <ul className="space-y-4">
                  {[
                    "Dedicated customer service available 24/7",
                    "Zero maintenance fees on savings accounts",
                    "Higher interest rates than traditional banks",
                    "Secure multi-factor authentication",
                    "Seamless money transfers between accounts"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link to="/services">
                    <Button className="bg-bank-primary hover:bg-bank-secondary text-white">
                      Explore Our Services
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
