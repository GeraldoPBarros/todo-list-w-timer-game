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

interface Item {
  id: number;
  name: string;
  isFinished: boolean;
}

type ListItems = Item[];

export default function Home() {
  const testList: ListItems = [
    {
      id: 1,
      name: "Insert values",
      isFinished: false,
    },
    {
      id: 2,
      name: "Finish coding",
      isFinished: false,
    },
  ];

  const [isInsertStatus, setIsInsertStatus] = useState<boolean>(true);
  const [insertText, setInsertText] = useState<string>("");
  const [todoList, setTodoList] = useState<ListItems>(testList);
  const [currentDay, setCurrentDay] = useState<string>("");

  useEffect(() => {
    const today = format(new Date(), "dd, MMM yyyy");
    setCurrentDay(today + ".")
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
                  onClick={() =>
                    setTodoList([
                      ...todoList,
                      {
                        id: todoList[todoList.length - 1].id + 1,
                        name: insertText,
                        isFinished: false,
                      },
                    ])
                  }
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
