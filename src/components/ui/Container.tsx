import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Container({ children, className = "", as: Tag = "div" }: ContainerProps) {
  return <Tag className={`container-x ${className}`}>{children}</Tag>;
}
