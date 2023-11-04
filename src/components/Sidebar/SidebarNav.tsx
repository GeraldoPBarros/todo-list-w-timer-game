import { Button, Icon, Stack, Text, useMediaQuery } from "@chakra-ui/react";
import {
  RiContactsLine,
  RiDashboardLine,
  RiInputMethodLine,
} from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import NavLink from "./NavLink";
import NavSection from "./NavSection";
import { MdOutlineExitToApp } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

export function SidebarNav() {
  const [isLargerThan990] = useMediaQuery("(min-width: 990px)");
  const { signOut } = useAuth();

  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="GENERAL">
        <NavLink href="/home" icon={FaCheck}>
          To-Do List
        </NavLink>
        <NavLink href="/history" icon={RiContactsLine}>
          History
        </NavLink>
        <NavLink href="/earnings" icon={RiDashboardLine}>
          Earnings
        </NavLink>
      </NavSection>

      <NavSection title="SETTINGS">
        <NavLink href="/tags" icon={RiInputMethodLine}>
          Tags
        </NavLink>
        {!isLargerThan990 && (
          <Button
            bg={"transparent"}
            color={"gray.300"}
            _hover={{ bg: "transparent" }}
            onClick={() => signOut()}
            fontWeight={"medium"}
            pl={0}
            mt={20}
          >
            <Icon as={MdOutlineExitToApp} fontSize={20} />
            <Text ml={4}>Sign Out</Text>
          </Button>
        )}
      </NavSection>
    </Stack>
  );
}
