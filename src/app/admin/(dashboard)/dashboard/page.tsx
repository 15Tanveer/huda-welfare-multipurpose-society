import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, CalendarCheck, CalendarClock, Image as ImageIcon, Mail, Users } from "lucide-react";
import { getDashboardStats } from "@/lib/data/admin";
import { StatCard } from "@/components/admin/StatCard";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Dashboard</h1>
        <p className="text-sm text-brand-muted">An overview of HUDA&apos;s website content.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Programs" value={stats.totalPrograms} icon={Calendar} />
        <StatCard label="Upcoming Programs" value={stats.upcomingPrograms} icon={CalendarClock} />
        <StatCard label="Completed Programs" value={stats.completedPrograms} icon={CalendarCheck} />
        <StatCard label="Gallery Images" value={stats.galleryImages} icon={ImageIcon} />
        <StatCard label="Volunteer Requests" value={stats.volunteerRequests} icon={Users} />
        <StatCard label="New Contact Messages" value={stats.newContactMessages} icon={Mail} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/programs/new"
          className="rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0f3d22]"
        >
          + New Program
        </Link>
        <Link
          href="/admin/gallery"
          className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-sm font-medium text-brand-deep hover:bg-brand-light"
        >
          Upload Gallery Photo
        </Link>
      </div>
    </div>
  );
}
