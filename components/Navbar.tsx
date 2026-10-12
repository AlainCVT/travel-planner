"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import { useEffect } from "react";

import { login, logout } from "@/lib/auth.actions";

import Icon from "./Icon";
import Logo from "./Logo";
import { Button } from "./ui/button";

export default function Navbar({ session }: { session: Session | null }) {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("travel-planner-theme");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    window.localStorage.setItem("travel-planner-theme", isDark ? "dark" : "light");
  }

  return (
    <header className="sticky top-4 container mx-auto my-4 px-2">
      <nav className="flex items-center justify-between rounded-lg border bg-background/40 px-2 py-2 backdrop-blur-sm lg:px-4">
        <Link href="/" className="flex h-9 items-center rounded-md">
          <Logo width={24} height={24} />
          <span className="px-2 text-lg font-bold">Travel Planner</span>
        </Link>
        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Button variant="ghost">Trips</Button>
              <Button variant="ghost">Globe</Button>
              <Button onClick={logout}>Sign out</Button>
            </>
          ) : (
            <Button onClick={login}>
              Sign in
              <Icon name="Logo/GitHub" />
            </Button>
          )}
          <Button
            aria-label="Toggle color theme"
            title="Toggle color theme"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            <Sun className="hidden dark:block" />
            <Moon className="dark:hidden" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
