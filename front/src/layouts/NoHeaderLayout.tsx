// front/src/layouts/NoHeaderLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import HamburgerMenu from "../features/nav/HamburgerMenu";

const NoHeaderLayout: React.FC = () => {
  return (
    <>
      {/* Кнопка меню всегда в правом верхнем углу */}
      <HamburgerMenu fixedWhenClosed />
      <Outlet />
    </>
  );
};

export default NoHeaderLayout;
