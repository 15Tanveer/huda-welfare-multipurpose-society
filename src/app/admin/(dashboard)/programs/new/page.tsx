import type { Metadata } from "next";
import { createProgram } from "@/actions/programs";
import { ProgramForm } from "@/components/admin/ProgramForm";

export const metadata: Metadata = { title: "New Program", robots: { index: false } };

export default function NewProgramPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-ink">New Program</h1>
        <p className="text-sm text-brand-muted">Create a new HUDA community program.</p>
      </div>

      <ProgramForm action={createProgram} submitLabel="Create Program" />
    </div>
  );
}
