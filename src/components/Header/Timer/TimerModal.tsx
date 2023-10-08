import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
} from "@chakra-ui/react";

interface ModalTimerType {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  currentTime: string;
}

export function TimerModal({
  isOpen,
  onClose,
  onOpen,
  currentTime,
}: ModalTimerType) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Realy want to finish timer?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentTime === "00:00:00"
              ? "Great! Take your reward."
              : "Timer is not finished! Your reward will not be complete!"}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Finish</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
