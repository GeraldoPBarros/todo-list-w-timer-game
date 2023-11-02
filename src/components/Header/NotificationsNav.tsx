import { useRewardsContext } from "@/context/RewardsContext";
import {
  Button,
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
} from "@chakra-ui/react";
import { RiNotificationLine } from "react-icons/ri";

export default function NotificationsNav() {
  const { notifications } = useRewardsContext();

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
          <Icon as={RiNotificationLine} fontSize="20" />
        </Button>
      </PopoverTrigger>
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
      </PopoverContent>
    </Popover>
  );
}
