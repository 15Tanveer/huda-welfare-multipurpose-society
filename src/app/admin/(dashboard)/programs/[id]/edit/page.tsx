import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramById, getProgramGallery } from "@/lib/data/programs";
import { updateProgram } from "@/actions/programs";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { ProgramGalleryManager } from "@/components/admin/ProgramGalleryManager";

export const metadata: Metadata = { title: "Edit Program", robots: { index: false } };

interface EditProgramPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = await params;
  const [program, gallery] = await Promise.all([getProgramById(id), getProgramGallery(id)]);

  if (!program) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">Edit Program</h1>
        <p className="text-sm text-brand-muted">{program.title}</p>
      </div>

      <ProgramForm
        program={program}
        action={updateProgram.bind(null, program.id)}
        submitLabel="Save Changes"
      />

      <section className="flex flex-col gap-5 rounded-2xl border border-brand-ink/8 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-deep">
          Program Gallery Photos
        </h2>
        <ProgramGalleryManager programId={program.id} items={gallery} />
      </section>
    </div>
  );
}
