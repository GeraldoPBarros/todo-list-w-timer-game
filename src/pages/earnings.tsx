import { api } from "../services/api";
import {
  Box,
  Code,
  Fade,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { GetServerSideProps } from "next";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useRewardsContext } from "@/context/RewardsContext";
import { calculateParticipantLevel } from "@/utils/levelSystem";
import { useAuth } from "@/context/AuthContext";

interface RewardsItem {
  time: string;
  date: string;
  advancedPercentage: string;
}

type RewardsList = RewardsItem[];

export default function History(rewards: RewardsList) {
  const [rewardsList, setRewardsList] = useState<any>(rewards);

  const { getRewards } = useRewardsContext();

  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      signOut();
    } else {
      getRewards("NOTHING");
    }
  }, []);

  useEffect(() => {
    setRewardsList(rewards);
  }, [rewards]);

  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Fade in={true}>
        <Box p={["6", "8"]} bg="gray.100" borderRadius={8} pb="4">
          <b>Earns On Each Task Finished</b>
          <br />
          <List spacing="4" mt={4}>
            <ListItem>
              {rewardsList.rewards.length > 0 &&
                rewardsList.rewards.map((item: RewardsItem, index: any) => (
                  <Stack direction={["row"]} spacing="8px" mb={2}>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    <Code
                      colorScheme="orange"
                      children={`Finished at: ${item.date}`}
                    />
                    <Text>{`.`}</Text>
                    <Code
                      colorScheme="yellow"
                      children={`Working time: ${item.time}`}
                    />
                    <Text>{`.`}</Text>
                    <Code
                      colorScheme="green"
                      children={`+ ${item.advancedPercentage}%`}
                    />
                  </Stack>
                ))}
            </ListItem>
          </List>
        </Box>
      </Fade>
    </SimpleGrid>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    let temp_rewards_percentages = [];
    let rewards_percentages: number[] = [];
    let last_sum = 0;

    const response = await api.get("rewards/manage_rewards");
    const tempRewards: any = response.data.rewards.data;

    for (let x = 0; x < tempRewards.length; x++) {
      temp_rewards_percentages.push(tempRewards[x]);
      const current_status_array = calculateParticipantLevel(
        temp_rewards_percentages
      );

      const how_much_increased =
        rewards_percentages.length > 0
          ? current_status_array[1] - last_sum
          : current_status_array[1];
      rewards_percentages.push(how_much_increased);
      last_sum = current_status_array[1];
    }

    const rewards: RewardsList = tempRewards.map(function (
      rewardsData: any,
      index: number
    ) {
      return {
        time: rewardsData.data.time,
        date: rewardsData.data.date,
        advancedPercentage: `${rewards_percentages[index].toFixed(2)}`,
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
