import { useRewardsContext } from "@/context/RewardsContext";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { RiNotificationLine } from "react-icons/ri";

export default function NotificationsNav() {
  const { notifications, setNotifications } = useRewardsContext();

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          mx={["4", "6"]}
          py="1"
          color="gray.300"
          bg={"transparent"}
          _hover={{ bg: "gray.100" }}
        >
          <Flex>
            <Icon as={RiNotificationLine} fontSize="20" />
            {notifications.length > 0 && (
              <Flex
                bg={"green.400"}
                w={5}
                h={5}
                zIndex={10}
                position={"absolute"}
                mt={3}
                ml={4}
                alignItems={"center"}
                justify="center"
                style={{ borderRadius: "15px" }}
              >
                <Text fontSize={12} color={"white"}>
                  +1
                </Text>
              </Flex>
            )}
          </Flex>
        </Button>
      </PopoverTrigger>
      {notifications.length > 0 && (
        <>
          <PopoverContent py={4}>
            <StatGroup px={4}>
              {notifications.length > 0 &&
                notifications.map((item) => (
                  <Stat>
                    <StatLabel>Finished</StatLabel>
                    <Stack direction={"row"} mt={"auto"}>
                      <StatNumber>{item.time}</StatNumber>
                      <StatHelpText mt={"auto"} pt={3}>
                        /
                        <StatArrow type="increase" ml={1} />
                        {item.increasedExperience}
                      </StatHelpText>
                    </Stack>
                  </Stat>
                ))}
            </StatGroup>
            <Divider />
            <Button
              h={30}
              bg={"transparent"}
              _hover={{ bg: "transparent" }}
              color={"gray.300"}
              onClick={() => setNotifications([])}
            >
              Clean{" "}
            </Button>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
