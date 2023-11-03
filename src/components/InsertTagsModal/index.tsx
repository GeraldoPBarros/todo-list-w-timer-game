import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Checkbox,
  Stack,
  Tag,
  Icon,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { MdOutlineSell } from "react-icons/md";

interface TagItem {
  id: number;
  name: string;
  createdAt: string;
}

type TagList = TagItem[];


interface ModalTimerType {
  tagList: TagList;
  onClose: () => void;
  isOpen: boolean;
  onEnd: (value: string[]) => void;
}

export function InsertTagsModal({
  tagList,
  isOpen,
  onClose,
  onEnd,
}: ModalTimerType) {
  const [tagsArr, setTagsArr] = useState<string[]>([]);

  function onChangeTag(tag: string) {
    if (!tagsArr.includes(tag)) {
      let newTags = tagsArr;
      newTags.push(tag);
      setTagsArr(newTags);
    } else {
      let newTags = tagsArr.filter((item) => item !== tag);
      setTagsArr(newTags);
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose task tags</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {tagList?.map((tag) => (
              <Stack direction={["row"]} spacing="8px" alignItems="center" mb={2}>
                <Checkbox
                  colorScheme="green"
                  onChange={() => onChangeTag(tag.name)}
                />
                <Tag variant="solid" colorScheme="linkedin" w={200}>
                  <Icon as={MdOutlineSell} mr={2} />
                  {tag.name}{" "}
                </Tag>
              </Stack>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onEnd(tagsArr);
                onClose();
                setTagsArr([]);
              }}
            >
              Finish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
