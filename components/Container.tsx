import clsx, { type ClassValue } from "clsx";
import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";

type ContainerProps<T extends ElementType = "div"> = PropsWithChildren<{
  as?: T;
  className?: ClassValue;
}> &
  ComponentPropsWithoutRef<T>;

export default function Container<T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component className={clsx("container mx-auto px-4 lg:px-6", className)} {...props}>
      {children}
    </Component>
  );
}
