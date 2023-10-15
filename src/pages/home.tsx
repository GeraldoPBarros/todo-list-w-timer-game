import { useState, useEffect } from "react";

import { format } from "date-fns";

import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  Input,
  Stack,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";

import { Sidebar } from "../components/Sidebar";
import { AddIcon, CloseIcon, DownloadIcon } from "@chakra-ui/icons";
import { GetServerSideProps } from "next";

import { api } from "../services/api";

interface Item {
  id: number;
  name: string;
  isFinished: boolean;
  idBd: any;
  createdAt: string;
}

type ListItems = Item[];

export default function Home({ tasks }: any) {
  const [isInsertStatus, setIsInsertStatus] = useState<boolean>(true);
  const [insertText, setInsertText] = useState<string>("");
  const [todoList, setTodoList] = useState<ListItems>([]);
  const [currentDay, setCurrentDay] = useState<string>("");
  const [archiveSpinner, setArchiveSpinner] = useState<boolean>(false);

  useEffect(() => {
    console.log(new Date());
    const today = format(new Date(), "dd, MMM yyyy");
    setCurrentDay(today + ".");
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const todoArr = [];
      for (let x = 0; x < tasks.length; x++) {
        todoArr.push(tasks[x]);
      }
      setTodoList(todoArr);
    }
  }, [tasks]);

  useEffect(() => {
    console.log("TodoList: ", todoList);
  }, [todoList]);

  const removeItemById = (idToRemove: number) => {
    console.log("ids: ", idToRemove);
    const updatedList = todoList.filter((item) => item.id !== idToRemove);
    setTodoList(updatedList);
  };

  const updateItemById = (idToUpdate: number) => {
    const newList = todoList.map((task) => {
      if (task.id === idToUpdate) {
        return { ...task, isFinished: !task.isFinished };
      }

      return task;
    });
    setTodoList(newList);
  };

  function CloseInsertionMode() {
    setInsertText("");
    setIsInsertStatus(true);
  }

  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Box p={["6", "8"]} bg="gray.100" borderRadius={8} pb="4">
        <Text fontSize="lg" mb="4">
          <Flex w="95%" justify="space-between">
            <Stack direction="row" spacing={4} alignItems="center">
              <b>Your Current List</b>
              {todoList.length > 31231231230 && (
                <Button
                  textDecoration="none"
                  _hover={{ textDecor: "none" }}
                  disabled={archiveSpinner}
                  onClick={async () => {
                    setArchiveSpinner(true);
                    for (let x = 0; x < todoList.length; x++) {
                      if (todoList[x].isFinished) {
                        const response = await api.put(
                          "api/history/tasks_history",
                          {
                            id: todoList[x].id,
                            name: todoList[x].name,
                            createdAt: todoList[x].createdAt,
                            finishedAt: format(new Date(), "dd, MMM yyyy pp"),
                          }
                        );
                        if (response.status === 200) {
                          const respHist = await api.delete(
                            `api/tasks/tasks_list`,
                            { params: { id: todoList[x].idBd } }
                          );
                          if (respHist.status === 200) {
                            removeItemById(todoList[x]?.id);
                          }
                        }
                      }
                    }
                    setArchiveSpinner(false);
                  }}
                >
                  <DownloadIcon boxSize={4} />
                  {archiveSpinner && <Spinner />}
                </Button>
              )}
            </Stack>

            <Text>{currentDay}</Text>
          </Flex>

          <br />

          <Flex direction="column">
            {todoList.length > 0 &&
              todoList.map((item: Item, index: any) => (
                <Stack
                  direction={["column", "row"]}
                  spacing="8px"
                  alignItems="center"
                >
                  <Checkbox
                    isChecked={item.isFinished}
                    colorScheme="green"
                    onChange={async () => {
                      const response = await api.put("api/tasks/tasks_by_id", {
                        name: item.name,
                        idBd: item.idBd,
                        isFinished: !item.isFinished,
                        createdAt: item.createdAt,
                      });
                      if (response.status === 200) {
                        updateItemById(item.idBd);
                      }
                    }}
                  ></Checkbox>
                  <Text key={item?.name}>{item?.name}</Text>
                  <Button
                    textDecoration="none"
                    _hover={{ textDecor: "none" }}
                    onClick={async () => {
                      const response = await api.put(
                        "api/history/tasks_history",
                        {
                          name: item.name,
                          createdAt: item.createdAt,
                          finishedAt: format(new Date(), "dd, MMM yyyy pp"),
                        }
                      );
                      if (response.status === 200) {
                        const respHist = await api.delete(
                          `api/tasks/tasks_list`,
                          { params: { id: item.idBd } }
                        );
                        if (respHist.status === 200) {
                          removeItemById(item?.id);
                        }
                      }
                    }}
                  >
                    <DownloadIcon boxSize={4} />
                  </Button>
                </Stack>
              ))}
          </Flex>
        </Text>
        {isInsertStatus && (
          <Button
            textDecoration="none"
            _hover={{ textDecor: "none" }}
            color="gray.500"
            onClick={() => setIsInsertStatus(false)}
          >
            + Insert
          </Button>
        )}
        {!isInsertStatus && (
          <Stack direction={["column", "row"]} spacing="8px">
            <Input
              placeholder="Insert Task"
              w="300px"
              value={insertText}
              onChange={(e) => setInsertText(e.target.value)}
            />
            <Button
              textDecoration="none"
              _hover={{ textDecor: "none" }}
              onClick={async () => {
                const response = await api.put("api/tasks/tasks_list", {
                  name: insertText,
                  isFinished: false,
                  createdAt: format(new Date(), "dd, MMM yyyy pp"),
                });
                if (response.status === 200) {
                  const responseRead = await api.get("api/tasks/tasks_list");
                  const nTDList = responseRead.data.tasks.data;
                  setTodoList([
                    ...todoList,
                    {
                      id: nTDList[nTDList.length - 1].ref["@ref"].id,
                      name: insertText,
                      isFinished: false,
                      idBd: nTDList[nTDList.length - 1].ref["@ref"].id,
                      createdAt: nTDList[nTDList.length - 1].data.createdAt,
                    },
                  ]);
                  setInsertText("");
                }
              }}
            >
              <AddIcon boxSize={3} />
            </Button>
            <Button
              textDecoration="none"
              _hover={{ textDecor: "none" }}
              onClick={() => CloseInsertionMode()}
            >
              <CloseIcon boxSize={3} />
            </Button>
          </Stack>
        )}
      </Box>
    </SimpleGrid>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  try {
    const response = await api.get("tasks/tasks_list");
    const tempTasks: any = response.data.tasks.data;
    // console.log("TASKS: ", response.data.tasks.data[0].ref["@ref"].id);
    const tasks: ListItems = tempTasks.map(function (task: any, index: any) {
      return {
        id: task.ref["@ref"].id,
        name: task.data.name,
        isFinished: task.data.isFinished,
        idBd: task.ref["@ref"].id,
        createdAt: task.data.createdAt,
      };
    });

    return {
      props: {
        tasks: tasks,
      },
    };
  } catch (err) {
    return {
      props: {
        tasks: [],
      },
    };
  }
};
