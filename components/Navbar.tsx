"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { useContext } from "react";

import { ThemeContext } from "@/contexts/theme";
import { login, logout } from "@/lib/actions/auth";

import Icon from "./Icon";
import Logo from "./Logo";
import { Button } from "./ui/button";

export default function Navbar({ session }: { session: Session | null }) {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <header className="pointer-events-none sticky top-0 z-100 container mx-auto px-2 py-4">
      <nav className="pointer-events-auto flex items-center justify-between rounded-lg border bg-background/80 px-2 py-2 backdrop-blur-sm lg:px-4">
        <Link href="/" className="flex h-9 items-center rounded-md">
          <Logo width={24} height={24} />
          <span className="px-2 text-lg font-bold whitespace-nowrap">Travel Planner</span>
        </Link>
        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/trips">Trips</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/globe">Globe</Link>
              </Button>
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
            onClick={() => {
              toggleTheme();
            }}
          >
            <Sun className="hidden dark:block" />
            <Moon className="dark:hidden" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
