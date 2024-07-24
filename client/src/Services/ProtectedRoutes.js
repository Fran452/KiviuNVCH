import React from 'react';
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoutes() {
    const auth = localStorage.getItem("token")
    return auth ? <Outlet /> : <Navigate to={"/"} />
}

export default ProtectedRoutes