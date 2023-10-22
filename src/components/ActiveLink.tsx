import { useSidebarDrawer } from "@/context/SidebarDrawerContext";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  shouldMatchExactHref?: boolean;
}

export function ActiveLink({
  children,
  shouldMatchExactHref = false,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();
  let isActive = false;
  const { isOpen } = useSidebarDrawer();

  if (shouldMatchExactHref && (asPath === rest.href || asPath === rest.as)) {
    isActive = true;
  }

  if (
    !shouldMatchExactHref &&
    (asPath.startsWith(String(rest.href)) || asPath.startsWith(String(rest.as)))
  ) {
    isActive = true;
  }

  if (isOpen) {
    return (
      <Link {...rest}>
        {cloneElement(children, {
          color: isActive ? "green.400" : "gray.300",
        })}
      </Link>
    );
  }

  return (
    <Link {...rest}>
      {cloneElement(children, {
        color: isActive ? "green.400" : "gray.700",
      })}
    </Link>
  );
}
