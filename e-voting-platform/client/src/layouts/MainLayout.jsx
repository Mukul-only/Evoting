import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen" data-scroll-container>
      {" "}
      {/* For Locomotive, if used */}
      <Navbar />
      <main className="flex-grow" data-scroll-section>
        {" "}
        {/* For Locomotive */}
        <Outlet />
      </main>
      <Footer data-scroll-section /> {/* For Locomotive */}
    </div>
  );
};

export default MainLayout;
