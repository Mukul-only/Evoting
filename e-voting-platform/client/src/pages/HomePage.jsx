import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import evmLogo from "../assets/evm_logo.png"; // Add a placeholder logo

// Sections (you'd typically componentize these)
const HeroSection = () => (
  <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-32">
    <div className="container mx-auto px-6 text-center md:text-left">
      <div className="md:flex md:items-center">
        <div className="md:w-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            E-Voting Machine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl mb-8"
          >
            A transparent, secure, and easy-to-use platform for conducting
            elections with integrity and confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-x-4"
          >
            <Link
              to="/login"
              className="btn bg-white text-primary hover:bg-gray-100 px-8 py-3"
            >
              Voter Login
            </Link>
            <Link
              to="/admin/login"
              className="btn border border-white text-white hover:bg-white hover:text-primary px-8 py-3"
            >
              Admin Login
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-4 text-sm"
          >
            New Voter?{" "}
            <Link to="/register" className="underline hover:text-indigo-200">
              Register here
            </Link>
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="md:w-1/2 mt-10 md:mt-0 flex justify-center items-center"
        >
          <div className="bg-gray-800 bg-opacity-50 rounded-full w-60 h-60 md:w-80 md:h-80 flex items-center justify-center shadow-2xl">
            <span className="text-7xl md:text-8xl font-bold text-white">
              EVM
            </span>
            {/* Or use an image: <img src={evmLogo} alt="EVM Logo" className="w-48 h-48"/> */}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const WhyChooseUsSection = () => (
  <section className="py-16 md:py-24 bg-neutralBg">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-darkText">
        Why Choose Hirmani's project EVM
      </h2>
      <p className="text-center text-mediumText mb-12 max-w-2xl mx-auto">
        Placeholder for why choose us text. We offer a revolutionary way to
        conduct elections, ensuring fairness, accessibility, and trust.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Secure Voting",
            description:
              "Utilizing advanced cryptographic techniques to ensure vote integrity and voter anonymity.",
          },
          {
            title: "Transparent Process",
            description:
              "Every step of the election is auditable, providing unparalleled transparency to all stakeholders.",
          },
          {
            title: "Real-time Results",
            description:
              "Get access to verified election results quickly and efficiently after the voting period concludes.",
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {feature.title}
            </h3>
            <p className="text-mediumText">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-darkText">
        How It Works?
      </h2>
      <div className="grid md:grid-cols-4 gap-8 text-center">
        {[
          {
            step: 1,
            title: "Register",
            description:
              "Create your voter account with secure identity verification.",
          },
          {
            step: 2,
            title: "Authenticate",
            description:
              "Log in safely with multi-factor authentication for enhanced security.",
          },
          {
            step: 3,
            title: "Vote",
            description:
              "Cast your vote securely in active elections from anywhere, anytime.",
          },
          {
            step: 4,
            title: "Verify",
            description:
              "Confirm your vote was counted correctly through our transparent verification system.",
          },
        ].map((item) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: item.step * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
              {item.step}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-darkText">
              {item.title}
            </h3>
            <p className="text-sm text-mediumText">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      {/* Add more sections as needed */}
    </motion.div>
  );
};

export default HomePage;
