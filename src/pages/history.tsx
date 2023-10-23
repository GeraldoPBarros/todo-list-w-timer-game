import { api } from "../services/api";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";

import { useEffect, useState } from "react";

import { Suspense, lazy } from "react";

let Plot = lazy(() => import("react-plotly.js"));

interface HistoryItem {
  id: number;
  name: string;
  createdAt: string;
  finishedAt: string;
}

type HistoryList = HistoryItem[];

export default function History({ history }: any) {
  const [historyList, setHistoryList] = useState<any>(history);

  useEffect(() => {
    if (history !== undefined) {
      setHistoryList(history.data);
    }
  }, [history]);

  useEffect(() => {
    console.log("historyList: ", historyList);
  }, [historyList]);


  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Box p={["6", "8"]} bg="gray.100" borderRadius={8} pb="4">
        <Suspense fallback={<p>LOADING</p>}>
          <Text>Daily task complete</Text>
          <Plot
            data={historyList || []}
            layout={{
              height: 320,
              xaxis: {
                showticklabels: true,
                ticks: "",
                range: [-0.5, historyList[0]?.x.length + 1 || 20],
                showline: true,
              },
              yaxis: {
                showticklabels: true,
                ticks: "",
                showline: true,
                range: [0, history.biggerValue + 1 || 20],
              },
            }}
            config={{ responsive: true, displayModeBar: false }}
          />
        </Suspense>
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
      mode: "lines+markers",
      line: {
        color: "rgb(128, 0, 128)",
        width: 1,
      },
      marker: {
        color: "rgb(128, 0, 128)",
        size: 8,
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
