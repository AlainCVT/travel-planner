"use client";

import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";

import { login, logout } from "@/lib/auth.actions";

import Icon from "./Icon";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="border-b border-gray-200 bg-white py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-8">
        <Link href="/" className="link">
          <Image src="/logo.svg" alt="logo" width={24} height={24} />
          <span className="px-2 text-xl font-bold">Travel Planner</span>
        </Link>
        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Link href="/trips" className="link">
                My Trips
              </Link>
              <Link href="/globe" className="link">
                Globe
              </Link>
              <button className="button" onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <button className="button" onClick={login}>
              Sign In
              <Icon name="Logo/GitHub" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
