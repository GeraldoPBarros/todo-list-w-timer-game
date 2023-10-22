import Head from "next/head";

import {
  Flex,
  Icon,
  IconButton,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react";

import { RiMenuLine } from "react-icons/ri";
import { useSidebarDrawer } from "../../context/SidebarDrawerContext";

import { useTimerContext } from "@/context/TimerContext";
import NotificationsNav from "./NotificationsNav";
import Profile from "./Profile";
import Logo from "./Logo";
import { Timer } from "./Timer";

export function Header() {
  const { onOpen } = useSidebarDrawer();
  const { currentTimer, isTimerRunning } = useTimerContext();

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [isLargerThan680] = useMediaQuery("(min-width: 680px)");

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
      {isTimerRunning ? (
        <Head>
          <title>{currentTimer}</title>
        </Head>
      ) : (
        <Head>
          <title>to-do list</title>
        </Head>
      )}

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

      {isLargerThan680 && <Logo isBig={false} />}

      <Flex align="center" ml="auto">
        <Timer />

        {isLargerThan680 && (
          <>
            <NotificationsNav />
            <Profile showProfileData={isWideVersion} />
          </>
        )}
      </Flex>
    </Flex>
  );
}
