import { api } from "../services/api";
import {
  Box,
  Button,
  Fade,
  Flex,
  Icon,
  Input,
  SimpleGrid,
  Stack,
  Tag,
} from "@chakra-ui/react";

import { format } from "date-fns";

import { MdOutlineSell } from "react-icons/md";
import { GetServerSideProps } from "next";

import { useEffect, useState } from "react";
import { useRewardsContext } from "@/context/RewardsContext";
import { useAuth } from "@/context/AuthContext";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

interface TagItem {
  id: number;
  name: string;
  createdAt: string;
}

type TagList = {
  tags: TagItem[];
};

export default function Tags(tags: TagList) {
  const [tagList, setTagList] = useState<TagList>(tags);
  const [isInsertStatus, setIsInsertStatus] = useState<boolean>(true);
  const [insertText, setInsertText] = useState<string>("");
  const { getRewards } = useRewardsContext();

  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user === null) {
      signOut();
    } else {
      getRewards("NOTHING");
    }
  }, []);

  useEffect(() => {
    console.log("Tags: ", tags);
  }, [tags]);

  async function OnAddTag(text: string) {
    const response = await api.put("api/tags/tag_manager", {
      name: text,
      createdAt: format(new Date(), "dd, MMM yyyy pp"),
    });
    if (response.status === 200) {
      const responseRead = await api.get("api/tags/tag_manager");
      const nTDList = responseRead.data.tags.data;
      const newList = [
        ...tagList.tags,
        {
          id: nTDList[nTDList.length - 1].ref["@ref"].id,
          name: insertText,
          createdAt: nTDList[nTDList.length - 1].data.createdAt,
        },
      ];
      setTagList({ tags: newList });
      CloseInsertionMode();
    }
  }

  async function removeItemById(idToRemove: number) {
    const respTags = await api.delete(`api/tags/tag_manager`, {
      params: { id: idToRemove },
    });
    if (respTags.status === 200) {
      const responseRead = await api.get("api/tags/tag_manager");
      const nTDList = responseRead.data.tags.data;
      const tags: TagItem[] = nTDList.map(function (
        tagData: any,
        index: number
      ) {
        return {
          id: tagData.ref["@ref"].id,
          name: tagData.data.name,
          createdAt: tagData.data.createdAt,
        };
      });
      setTagList({ tags: tags });
    }
  }

  function CloseInsertionMode() {
    setInsertText("");
    setIsInsertStatus(true);
  }

  return (
    <SimpleGrid flex="1" gap="4" minChildWidth="320px" alignItems="flex-start">
      <Fade in={true}>
        <Box p={["6", "8"]} bg="gray.100" borderRadius={8} pb="4">
          <SimpleGrid columns={4} spacing={10}>
            {tagList.tags.length > 0 &&
              tagList.tags.map((item: TagItem, index: any) => (
                <Flex direction={"column"} alignItems={"flex-start"}>
                  <Tag variant="solid" colorScheme="linkedin" w={200}>
                    <Icon as={MdOutlineSell} mr={2} />
                    {item.name}{" "}
                  </Tag>
                  <Button
                    bg={"transparent"}
                    _hover={{
                      bg: "transparent",
                      borderBottom: "1px solid gray.400",
                    }}
                    fontSize={12}
                    h={10}
                    m={0}
                    p={0}
                    onClick={() => removeItemById(item.id)}
                  >
                    Remove
                  </Button>
                </Flex>
              ))}
          </SimpleGrid>

          {isInsertStatus && (
            <Button
              textDecoration="none"
              _hover={{ textDecor: "none" }}
              color="gray.500"
              onClick={() => setIsInsertStatus(false)}
            >
              + Tag
            </Button>
          )}
          {!isInsertStatus && (
            <Stack direction={["column", "row"]} spacing="8px">
              <Input
                placeholder="Insert Tag"
                w="300px"
                value={insertText}
                onChange={(e) => setInsertText(e.target.value)}
              />
              <Button
                textDecoration="none"
                _hover={{ textDecor: "none" }}
                onClick={async () => OnAddTag(insertText)}
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
      </Fade>
    </SimpleGrid>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await api.get("tags/tag_manager");
    const tempTags: any = response.data.tags.data;

    const tags: TagList = tempTags.map(function (tagData: any, index: number) {
      return {
        id: tagData.ref["@ref"].id,
        name: tagData.data.name,
        createdAt: tagData.data.createdAt,
      };
    });
    return {
      props: {
        tags,
      },
    };
  } catch (err) {
    return {
      props: {
        tags: [],
      },
    };
  }
};
