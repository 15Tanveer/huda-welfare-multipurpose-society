import type { Metadata } from "next";
import { createTeamMember } from "@/actions/team";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata: Metadata = { title: "New Team Member", robots: { index: false } };

export default function NewTeamMemberPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">New Team Member</h1>
        <p className="text-sm text-brand-muted">Add someone to HUDA&apos;s public team listing.</p>
      </div>
      <TeamMemberForm action={createTeamMember} submitLabel="Add Member" />
    </div>
  );
}
