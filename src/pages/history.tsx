import { HistoryGraph } from "@/components/HistoryGraph";
import { api } from "../services/api";
import {
  Box,
  Button,
  Code,
  Flex,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Suspense } from "react";
import { HistoryCard } from "@/components/Cards";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { history_options } from "@/utils/historyOptions";
import { useRewardsContext } from "@/context/RewardsContext";
import { useAuth } from "@/context/AuthContext";

interface HistoryItem {
  id: number;
  name: string;
  createdAt: string;
  finishedAt: string;
}

type HistoryList = HistoryItem[];

type HistorySelector = "7 days" | "15 days" | "30 days" | "60 days"; // | "All";

export default function History({ history }: any) {
  const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");

  const [historyList, setHistoryList] = useState<any>(
    history?.historyList || []
  );
  const [selectedHistoryList, setSelectedHistoryList] = useState<any>(
    history?.historyList ?? []
  );
  const [histSelector, setHistSelector] = useState<HistorySelector>("7 days");

  const { getRewards } = useRewardsContext();

  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      signOut();
      router.push("/", { scroll: false });
    } else {
      isDayWithinRange(new Date().toString(), "7 days", history.data);
      isTasksWithinDayRange(
        new Date().toString(),
        "7 days",
        history.historyList
      );
      getRewards();
    }
  }, []);

  useEffect(() => {
    isDayWithinRange(new Date().toString(), histSelector, history.data);
    isTasksWithinDayRange(
      new Date().toString(),
      histSelector,
      history.historyList
    );
  }, [histSelector]);

  function isDayWithinRange(
    currentDay: string,
    daysInThePast: string,
    historyList: any
  ) {
    const currentDate = new Date(currentDay);
    const daysAgo = new Date(currentDate);
    const [number, unit] = daysInThePast.split(" ");
    const tasks_on_specified_days = [];
    const counts_on_specified_days = [];

    if (unit === "days") {
      daysAgo.setDate(currentDate.getDate() - parseInt(number, 10));
    } else {
      throw new Error('Unsupported time unit. Use "days"');
    }

    for (let i = 0; i < historyList[0].x.length; i++) {
      const targetDate = new Date(historyList[0].x[i]);

      if (targetDate >= daysAgo && targetDate <= currentDate) {
        tasks_on_specified_days.push(historyList[0].x[i]);
        counts_on_specified_days.push(historyList[0].y[i]);
      }
    }
    setSelectedHistoryList({
      x: tasks_on_specified_days,
      y: counts_on_specified_days,
      type: "bar",
      width: 0.5,
      marker: {
        color: "rgb(128, 0, 128)",
        size: 1,
      },
    });
  }

  function isTasksWithinDayRange(
    currentDay: string,
    daysInThePast: string,
    historyList: any
  ) {
    const currentDate = new Date(currentDay);
    const daysAgo = new Date(currentDate);
    const [number, unit] = daysInThePast.split(" ");
    const tasks_on_specified_days = [];

    if (unit === "days") {
      daysAgo.setDate(currentDate.getDate() - parseInt(number, 10));
    } else {
      throw new Error('Unsupported time unit. Use "days"');
    }

    for (let i = 0; i < historyList.length; i++) {
      const targetDate = new Date(historyList[i].finishedAt);

      if (targetDate >= daysAgo && targetDate <= currentDate) {
        tasks_on_specified_days.push(historyList[i]);
      }
    }
    setHistoryList(tasks_on_specified_days);
  }

  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Flex direction="column" p={["6", "8"]} bg="gray.100" borderRadius={8}>
        <Flex direction="row">
          <HistoryCard
            title="Completed Tasks"
            value={history.historyList.length || 0}
          />
          <HistoryCard
            title="Pending Tasks"
            value={history.countTasks ? history.countTasks : "0"}
            margin="10px"
          />
        </Flex>
        <br />

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            bg="gray.50"
            mb={4}
            w={130}
          >
            {histSelector}
          </MenuButton>

          <MenuList zIndex={10}>
            {history_options.map((value: HistorySelector) => (
              <MenuItem zIndex={11} onClick={() => setHistSelector(value)}>
                {value}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Suspense
          fallback={
            <Stack
              h={300}
              w={1000}
              direction={isLargerThan1200 ? "row" : "column"}
            >
              <Box h={400} w={450}>
                <Skeleton height="30px" mb={4} mt={20} />
                <Skeleton height="30px" mb={4} />
                <Skeleton height="30px" mb={4} />
                <Text>Loading ... </Text>
              </Box>
              <Box h={400} w={450} ml={8}>
                <Skeleton height="30px" mb={4} mt={20} />
                <Skeleton height="30px" mb={4} />
                <Skeleton height="30px" mb={4} />
              </Box>
            </Stack>
          }
        >
          <Flex direction={isLargerThan1200 ? "row" : "column"}>
            <Stack
              direction="column"
              spacing="2"
              borderRight={isLargerThan1200 ? "1px solid" : "none"}
              borderColor={isLargerThan1200 ? "gray.200" : "none"}
              mr={4}
              mb={5}
              pr={4}
              w={520}
            >
              <Text mb="-35" ml="2" zIndex={5}>
                Daily task complete
              </Text>
              <HistoryGraph data={selectedHistoryList} />
            </Stack>
            <List spacing="4">
              <ListItem>
                {historyList.length > 0 &&
                  historyList.map((item: HistoryItem) => (
                    <Stack direction={["row"]} spacing="8px" mb={2}>
                      <Code colorScheme="orange" children={`${item.name}`} />
                      <Text>{`>`}</Text>
                      <Code
                        colorScheme="green"
                        children={`${item.finishedAt}`}
                      />
                    </Stack>
                  ))}
              </ListItem>
            </List>
          </Flex>
        </Suspense>
      </Flex>
    </SimpleGrid>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await api.get("history/tasks_history");
    const tempHistory: any = response.data.history.data;
    const hashValues = new Map();
    let biggerValue = 10;

    const responseTasks = await api.get("tasks/tasks_list");
    const countTasks = responseTasks.data.tasks.data.length;

    for (let x = 0; x < tempHistory.length; x++) {
      const split_Array_Finished = tempHistory[x].data.finishedAt.split(" ");
      const finished_at_Data = `${split_Array_Finished[0]} ${split_Array_Finished[1]} ${split_Array_Finished[2]}`;
      if (hashValues.get(`${finished_at_Data}`) === undefined) {
        hashValues.set(`${finished_at_Data}`, 1);
      } else {
        hashValues.set(
          `${finished_at_Data}`,
          hashValues.get(finished_at_Data) + 1
        );
      }
    }

    const historyList: HistoryList = tempHistory.map(function (histData: any) {
      return {
        name: histData.data.name,
        createdAt: histData.data.createdAt,
        finishedAt: histData.data.finishedAt,
      };
    });

    const temp_x: any = [];
    const temp_y: any = [];

    hashValues.forEach((value, key) => {
      if (value > biggerValue) biggerValue = value;
      temp_x.push(key);
      temp_y.push(value);
    });

    const history = {
      x: temp_x,
      y: temp_y,
      type: "bar",
      width: 0.2,
      marker: {
        color: "rgb(128, 0, 128)",
        size: 1,
      },
    };

    return {
      props: {
        history: {
          id: "Data",
          data: [history],
          biggerValue,
          historyList,
          countTasks,
        },
      },
    };
  } catch (err) {
    return {
      props: {
        history: [],
      },
    };
  }
};
