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

type TimerStatus = "RUNNING" | "STOPPED" | "PAUSED";

interface ModalTimerType {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  currentTime: string;
  onEnd: (value: TimerStatus) => void;
}

export function TimerModal({
  isOpen,
  onClose,
  onOpen,
  currentTime,
  onEnd,
}: ModalTimerType) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Do you realy want to finish the timer?</ModalHeader>
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
            <Button
              variant="ghost"
              onClick={() => {
                onEnd("STOPPED");
                onClose();
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
