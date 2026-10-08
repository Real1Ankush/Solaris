import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

function classFor(variant: ButtonVariant, size: ButtonSize, extra?: string) {
  return clsx("ds-btn", `ds-btn--${variant}`, `ds-btn--${size}`, extra);
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={classFor(variant, size, className)}
      {...rest}
    />
  );
});

export type ButtonLinkProps = {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "to" | "className">;

export function ButtonLink({
  to,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link to={to} className={classFor(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
