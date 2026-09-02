import { Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function PublicNotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light text-brand-deep">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>
      <h1 className="text-3xl font-semibold text-brand-ink">Page not found</h1>
      <p className="max-w-md text-brand-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button href="/" size="md">
        Back to Home
      </Button>
    </Container>
  );
}
