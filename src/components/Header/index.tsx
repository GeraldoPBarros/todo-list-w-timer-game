import { Flex, Icon, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { RiMenuLine } from "react-icons/ri";
import { useSidebarDrawer } from "../../context/SidebarDrawerContext";
import Logo from "./Logo";
import NotificationsNav from "./NotificationsNav";
import Profile from "./Profile";
import { Timer } from "./Timer";

export function Header() {
  const { onOpen } = useSidebarDrawer();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      {!isWideVersion && (
        <IconButton
          aria-label="Open navigation"
          variant="unstyled"
          fontSize="24"
          icon={<Icon as={RiMenuLine} m="0" />}
          onClick={onOpen}
          mr="2"
        />
      )}

      <Logo isBig={false} />

      <Flex align="center" ml="auto">
        <Timer />
        <NotificationsNav />
        <Profile showProfileData={isWideVersion} />
      </Flex>
    </Flex>
  );
}
