"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Users,
  UsersRound,
} from "lucide-react";
import { logoutAdmin } from "@/actions/auth";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/programs", label: "Programs", icon: Calendar },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/team", label: "Team", icon: UsersRound },
  { href: "/admin/volunteers", label: "Volunteer Requests", icon: Users },
  { href: "/admin/contacts", label: "Contact Messages", icon: Mail },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={`flex h-full flex-col gap-1 ${className}`}>
      <div className="px-3 pb-6 pt-2">
        <p className="text-lg font-bold text-white">HUDA Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAdmin} className="pt-4">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </form>
    </div>
  );
}
