import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="bg-brand-deep py-14">
      <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Stay Connected</h2>
          <p className="max-w-md text-sm text-white/75">
            Subscribe to hear about HUDA&apos;s upcoming programs and community updates.
          </p>
        </div>
        <div className="w-full sm:max-w-sm">
          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}
