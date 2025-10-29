 import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const Auth = () => {
    const user  = useSelector(state => state.auth.user);
    console.log(user)
    if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default Auth;
