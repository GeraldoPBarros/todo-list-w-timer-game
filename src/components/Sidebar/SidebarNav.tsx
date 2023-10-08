import { Stack } from "@chakra-ui/react";
import {
  RiContactsLine,
  RiDashboardLine,
  RiGitMergeLine,
  RiInputMethodLine,
} from "react-icons/ri";
import {
  FaCheck
} from "react-icons/fa"
import NavLink from "./NavLink";
import NavSection from "./NavSection";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GENERAL">
        <NavLink href="/home" icon={FaCheck}>
          To-Do List
        </NavLink>
        <NavLink href="/users" icon={RiContactsLine}>
          History
        </NavLink>
        <NavLink href="/users" icon={RiDashboardLine}>
          Groups
        </NavLink>
      </NavSection>

      <NavSection title="SETTINGS">
        <NavLink href="/tags" icon={RiInputMethodLine}>
          Tags
        </NavLink>
      </NavSection>
    </Stack>
  );
}
