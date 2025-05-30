import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      {/* 
        This layout is for pages like Login, Register, Forgot Password.
        It usually doesn't have a Navbar or Footer from the MainLayout.
        The pages themselves define their full-screen styling.
      */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
