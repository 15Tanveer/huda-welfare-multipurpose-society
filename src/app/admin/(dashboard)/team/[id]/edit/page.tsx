import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamMemberById } from "@/lib/data/team";
import { updateTeamMember } from "@/actions/team";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata: Metadata = { title: "Edit Team Member", robots: { index: false } };

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Edit Team Member</h1>
        <p className="text-sm text-brand-muted">{member.name}</p>
      </div>
      <TeamMemberForm member={member} action={updateTeamMember.bind(null, member.id)} submitLabel="Save Changes" />
    </div>
  );
}
