"use client";

import { useState } from "react";
import { TopBar } from "./top-bar";
import { MainHeader } from "./main-header";
import { NavBar } from "./nav-bar";
import { MobileNav } from "./mobile-nav";
import { CategoryDrawer } from "./category-drawer";
import type { Category } from "@/types";

interface HeaderProps {
  categories: Category[];
}

export function Header({ categories }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 print:hidden">
      <TopBar />
      <MainHeader
        onMenuOpen={() => setMobileOpen(true)}
        onCategoryDrawerOpen={() => setDrawerOpen(true)}
      />
      <NavBar categories={categories} />
      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
      />
      <CategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
      />
    </header>
  );
}
