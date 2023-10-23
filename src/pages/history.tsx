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

import { ResponsiveLine } from "@nivo/line";

import { useEffect, useState } from "react";
import { te } from "date-fns/locale";

interface HistoryItem {
  id: number;
  name: string;
  createdAt: string;
  finishedAt: string;
}

type HistoryList = HistoryItem[];

export default function History(history: any) {
  const [historyList, setHistoryList] = useState<any>(history);

  useEffect(() => {
    setHistoryList(history);
  }, [history]);

  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Box p={["6", "8"]} bg="gray.100" borderRadius={8} pb="4">
        {/*
        <ResponsiveLine
          data={[]}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "transportation",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "count",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
        */}
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
    const hashValues = new Map();

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

    const history: any = [];

    hashValues.forEach((value, key) => {
      history.push({
        x: key,
        y: value,
      });
    });

    return {
      props: {
        history: {
          id: "Data",
          data: history,
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
