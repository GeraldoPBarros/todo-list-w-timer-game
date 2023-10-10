import { useState, useEffect } from "react";

import { format, compareAsc } from "date-fns";

import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Text,
  Input,
  Stack,
  Checkbox,
} from "@chakra-ui/react";

import { Sidebar } from "../components/Sidebar";
import { AddIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { GetServerSideProps } from "next";

import { api } from "../services/api";

interface Item {
  id: number;
  name: string;
  isFinished: boolean;
}

type ListItems = Item[];

export default function Home({ tasks }: any) {
  const [isInsertStatus, setIsInsertStatus] = useState<boolean>(true);
  const [insertText, setInsertText] = useState<string>("");
  const [todoList, setTodoList] = useState<ListItems>([]);
  const [currentDay, setCurrentDay] = useState<string>("");

  useEffect(() => {
    const today = format(new Date(), "dd, MMM yyyy");
    setCurrentDay(today + ".");

    if (tasks.length > 0) {
      const todoArr = [];
      for (let x = 0; x < tasks.length; x++) {
        todoArr.push(tasks[x].data);
      }
      setTodoList(todoArr);
    }
  }, []);

  const removeItemById = (idToRemove: number) => {
    const updatedList = todoList.filter((item) => item.id !== idToRemove);
    setTodoList(updatedList);
  };

  function CloseInsertionMode() {
    setInsertText("");
    setIsInsertStatus(true);
  }

  return (
    <Flex direction="column" h="100vh">
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box p={["6", "8"]} bg="gray.100" borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              <Flex w="95%" justify="space-between">
                <b>Current List</b>
                <Text>{currentDay}</Text>
              </Flex>

              <Flex direction="column">
                {todoList.map((item: Item, index: any) => (
                  <Stack
                    direction={["column", "row"]}
                    spacing="8px"
                    alignItems="center"
                  >
                    <Checkbox></Checkbox>
                    <Text key={item.name}>{item.name}</Text>
                    <Button
                      textDecoration="none"
                      _hover={{ textDecor: "none" }}
                      onClick={() => removeItemById(item.id)}
                    >
                      <DeleteIcon boxSize={3} />
                    </Button>
                  </Stack>
                ))}
              </Flex>
            </Text>
            {isInsertStatus && (
              <Button
                textDecoration="none"
                _hover={{ textDecor: "none" }}
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
                      id:
                        todoList.length > 0
                          ? todoList[todoList.length - 1].id + 1
                          : 1,
                      name: insertText,
                      isFinished: false,
                    });
                    if (response.status === 200) {
                      setTodoList([
                        ...todoList,
                        {
                          id:
                            todoList.length > 0
                              ? todoList[todoList.length - 1].id + 1
                              : 1,
                          name: insertText,
                          isFinished: false,
                        },
                      ]);
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
      </Flex>
    </Flex>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  try {
    const response = await api.get("tasks/tasks_list");
    const tasks = response.data.tasks.data;

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
