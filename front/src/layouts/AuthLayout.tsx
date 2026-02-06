// front/src/layouts/AuthLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../features/header/components/Header";

// На этих страницах теперь тоже есть Header, но он не sticky.
const AuthLayout: React.FC = () => {
  return (
    <>
      <Header sticky={false} />
      <Outlet />
    </>
  );
};

export default AuthLayout;
