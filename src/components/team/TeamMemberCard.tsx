import Image from "next/image";
import { User } from "lucide-react";
import type { TeamMemberRow } from "@/types/database";
import { getPublicImageUrl } from "@/lib/supabase/storage";

export function TeamMemberCard({ member }: { member: TeamMemberRow }) {
  const photoUrl = getPublicImageUrl(member.photo_url);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-ink/8 bg-white p-6 text-center shadow-sm shadow-brand-ink/5">
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-brand-light">
        {photoUrl ? (
          <Image src={photoUrl} alt={member.name} fill sizes="96px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-deep">
            <User className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-brand-ink">{member.name}</p>
        <p className="text-sm text-brand">{member.role}</p>
        {member.designation ? (
          <p className="text-xs text-brand-muted">{member.designation}</p>
        ) : null}
      </div>
      {member.bio ? (
        <p className="text-sm leading-relaxed text-brand-muted">{member.bio}</p>
      ) : null}
    </div>
  );
}
