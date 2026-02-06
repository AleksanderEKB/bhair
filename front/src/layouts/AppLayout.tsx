// front/src/layouts/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../features/header/components/Header";

const AppLayout: React.FC = () => {
  return (
    <>
      <Header sticky />
      <Outlet />
    </>
  );
};

export default AppLayout;
