import { HistoryGraph } from "@/components/HistoryGraph";
import { api } from "../services/api";
import {
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";

import { useEffect, useState } from "react";

import { Suspense } from "react";
import { HistoryCard } from "@/components/Cards";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { history_options } from "@/utils/historyOptions";

interface HistoryItem {
  id: number;
  name: string;
  createdAt: string;
  finishedAt: string;
}

type HistoryList = HistoryItem[];

type HistorySelector = "7 days" | "15 days" | "30 days" | "60 days" | "All";

export default function History({ history }: any) {
  const [historyList, setHistoryList] = useState<any>(history);
  const [histSelector, setHistSelector] = useState<HistorySelector>("7 days");

  useEffect(() => {
    if (history !== undefined) {
      setHistoryList(history.data);
    }
  }, [history]);

  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Flex direction="column" p={["6", "8"]} bg="gray.100" borderRadius={8}>
        <Flex direction="row">
          <HistoryCard title="Completed Tasks" value="46" />
          <HistoryCard title="Pending Tasks" value="30" margin="10px" />
        </Flex>
        <br />

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            bg="gray.200"
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

        <Suspense fallback={<p>LOADING</p>}>
          <Flex direction="row">
            <Stack direction="column" spacing="2">
              <Text mb="-35" ml="2" zIndex={5}>
                Daily task complete
              </Text>
              <HistoryGraph data={historyList} />
            </Stack>
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
