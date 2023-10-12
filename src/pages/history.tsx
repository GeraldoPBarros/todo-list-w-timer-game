import { api } from "../services/api";
import {
  Box,
  Code,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdCheckCircle } from 'react-icons/md'
import { GetServerSideProps } from "next";

import { useEffect, useState } from "react";

interface HistoryItem {
  id: number;
  name: string;
  createdAt: string;
  finishedAt: string;
}

type HistoryList = HistoryItem[];

export default function History(history: HistoryList) {
  const [historyList, setHistoryList] = useState<any>(history);

  useEffect(() => {
    console.log("history: ", history);
    setHistoryList(history);
  }, [history]);

  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Box p={["6", "8"]} bg="gray.100" borderRadius={8} pb="4">
        <List  spacing="4">
          <ListItem>
            {historyList.history.length > 0 &&
              historyList.history.map((item: HistoryItem, index: any) => (
                <Stack direction={["row"]} spacing="8px" mb={2}>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  <Code children={`${item.name}`} />
                  <Text>{`.`}</Text>
                  <Code
                    colorScheme="green"
                    children={`Started at: ${item.createdAt}`}
                  />
                  <Text>{`.`}</Text>
                  <Code
                    colorScheme="yellow"
                    children={`Finished at: ${item.finishedAt}`}
                  />
                </Stack>
              ))}
          </ListItem>
        </List>
      </Box>
    </SimpleGrid>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  try {
    const response = await api.get("history/tasks_history");
    const tempHistory: any = response.data.history.data;
    // console.log("TASKS: ", response.data.tasks.data[0].ref["@ref"].id);
    const history: HistoryList = tempHistory.map(function (
      histData: any,
      index: any
    ) {
      return {
        id: histData.data.id,
        name: histData.data.name,
        createdAt: histData.data.createdAt,
        finishedAt: histData.data.finishedAt,
      };
    });

    return {
      props: {
        history: history,
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
