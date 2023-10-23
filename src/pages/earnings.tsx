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
import { MdCheckCircle } from "react-icons/md";
import { GetServerSideProps } from "next";

import { useEffect, useState } from "react";

interface RewardsItem {
  time: string;
  date: string;
}

type RewardsList = RewardsItem[];

export default function History(rewards: RewardsList) {
  const [rewardsList, setRewardsList] = useState<any>(rewards);

  useEffect(() => {
    setRewardsList(rewards);
  }, [rewards]);

  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Box p={["6", "8"]} bg="gray.100" borderRadius={8} pb="4">
        <List spacing="4">
          <ListItem>
            {rewardsList.rewards.length > 0 &&
              rewardsList.rewards.map((item: RewardsItem, index: any) => (
                <Stack direction={["row"]} spacing="8px" mb={2}>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  <Code colorScheme="orange" children={`Finished at: ${item.date}`} />
                  <Text>{`.`}</Text>
                  <Code
                    colorScheme="green"
                    children={`Working time: ${item.time}`}
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
    const response = await api.get("rewards/manage_rewards");
    const tempHistory: any = response.data.rewards.data;
    console.log("rewards: ", response.data.rewards.data);
    const rewards: RewardsList = tempHistory.map(function (
      histData: any,
      index: any
    ) {
      return {
        time: histData.data.time,
        date: histData.data.date,
      };
    });

    return {
      props: {
        rewards: rewards,
      },
    };
  } catch (err) {
    return {
      props: {
        rewards: [],
      },
    };
  }
};
