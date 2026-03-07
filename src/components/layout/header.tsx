"use client";

import { useState } from "react";
import { TopBar } from "./top-bar";
import { MainHeader } from "./main-header";
import { NavBar } from "./nav-bar";
import { MobileNav } from "./mobile-nav";
import { CategoryDrawer } from "./category-drawer";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <MainHeader
        onMenuOpen={() => setMobileOpen(true)}
        onCategoryDrawerOpen={() => setDrawerOpen(true)}
      />
      <NavBar />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </header>
  );
}
