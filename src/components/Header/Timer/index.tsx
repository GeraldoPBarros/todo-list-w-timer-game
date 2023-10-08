import { TimeIcon } from "@chakra-ui/icons";
import {
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaCheck } from "react-icons/fa";

import { useState, useEffect } from "react";

import { TimerModal } from "./TimerModal";

interface Timer {}

type TimerStatus = "RUNNING" | "STOPPED" | "PAUSED";

let timer: NodeJS.Timeout;

export function Timer() {
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("STOPPED");
  const [timerValue, setTimerValue] = useState<string>("00:00:20");

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (timerStatus == "RUNNING") {
      const [hours, minutes, seconds] = timerValue.split(":").map(Number);

      if (hours === 0 && minutes === 0 && seconds === 0) {
        // Timer reached zero, stop the timer
        setTimerStatus("STOPPED");
        return;
      }

      timer = setInterval(() => {
        if (seconds > 0) {
          setTimerValue(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${(seconds - 1).toString().padStart(2, "0")}`
          );
        } else if (minutes > 0) {
          setTimerValue(
            `${hours.toString().padStart(2, "0")}:${(minutes - 1)
              .toString()
              .padStart(2, "0")}:59`
          );
        } else {
          setTimerValue(`${(hours - 1).toString().padStart(2, "0")}:59:59`);
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timerStatus, timerValue]);

  return (
    <Stack direction={["row"]} spacing="8px">
      <TimerModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        currentTime={timerValue}
      />
      <Button
        textDecoration="none"
        _hover={{ textDecor: "none" }}
        onClick={() => setTimerStatus("RUNNING")}
      >
        <FaPlay boxSize={3} />
      </Button>

      {timerStatus === "PAUSED" ? (
        <Button
          textDecoration="none"
          _hover={{ textDecor: "none" }}
          onClick={() => onOpen()}
        >
          <FaCheck boxSize={3} />
        </Button>
      ) : (
        <Button
          textDecoration="none"
          _hover={{ textDecor: "none" }}
          onClick={() => setTimerStatus("PAUSED")}
        >
          <FaPause boxSize={3} />
        </Button>
      )}

      <InputGroup>
        <Input
          value={timerValue}
          onChange={(e) => setTimerValue(e.target.value)}
          w="130px"
          disabled={timerStatus === "RUNNING"}
        />
        <InputLeftElement>
          <TimeIcon />
        </InputLeftElement>
      </InputGroup>
    </Stack>
  );
}
