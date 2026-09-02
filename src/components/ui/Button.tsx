import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-deep shadow-sm shadow-brand-deep/10",
  secondary:
    "bg-brand-deep text-white hover:bg-[#0f3d22] shadow-sm shadow-brand-deep/10",
  outline:
    "border border-brand/30 text-brand-deep bg-white hover:bg-brand-light",
  ghost: "text-brand-deep hover:bg-brand-light",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-base",
  lg: "px-6 py-3.5 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-60";

interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

interface ButtonAsButton
  extends ButtonStyleProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonStyleProps> {
  href?: undefined;
  children: ReactNode;
}

interface ButtonAsLink extends ButtonStyleProps {
  href: string;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  children: ReactNode;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: ButtonStyleProps) {
  return `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

export function Button(props: ButtonProps) {
  const classes = buttonClasses(props);

  if (props.href) {
    const { href, target, rel, children } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant, size, className, children, ...rest } = props;
  void variant;
  void size;
  void className;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
