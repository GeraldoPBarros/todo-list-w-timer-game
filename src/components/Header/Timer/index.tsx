import { TimeIcon } from "@chakra-ui/icons";
import {
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  Button,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaCheck } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";

import { useState, useEffect } from "react";

import { TimerModal } from "./TimerModal";
import { useTimerContext } from "@/context/TimerContext";

interface Timer {}

type TimerStatus = "RUNNING" | "STOPPED" | "PAUSED";

let timer: NodeJS.Timeout;

export function Timer() {
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("STOPPED");
  const { currentTimer, setCurrentTimer, setIsTimerRunning } = useTimerContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    console.log("TimerStatus: ", timerStatus);
    if (timerStatus === "RUNNING") {
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [timerStatus]);

  useEffect(() => {
    if (timerStatus == "RUNNING") {
      const [hours, minutes, seconds] = currentTimer.split(":").map(Number);

      if (hours === 0 && minutes === 0 && seconds === 0) {
        // Timer reached zero, stop the timer
        setTimerStatus("STOPPED");
        return;
      }

      timer = setInterval(() => {
        if (seconds > 0) {
          setCurrentTimer(
            `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${(seconds - 1).toString().padStart(2, "0")}`
          );
        } else if (minutes > 0) {
          setCurrentTimer(
            `${hours.toString().padStart(2, "0")}:${(minutes - 1)
              .toString()
              .padStart(2, "0")}:59`
          );
        } else {
          setCurrentTimer(`${(hours - 1).toString().padStart(2, "0")}:59:59`);
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timerStatus, currentTimer]);

  return (
    <Stack direction={["row"]} spacing="8px">
      <TimerModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        currentTime={currentTimer}
        onEnd={setTimerStatus}
      />
      <Button
        textDecoration="none"
        disabled={timerStatus === "RUNNING"}
        onClick={() => setTimerStatus("RUNNING")}
      >
        <FaPlay boxSize={3} />
      </Button>

      {timerStatus === "STOPPED" && (
        <Button
          textDecoration="white"
          _hover={{ textDecor: "none" }}
          disabled
          onClick={() => null}
        >
          <FaPause boxSize={3} />
        </Button>
      )}

      {timerStatus === "RUNNING" && (
        <Button textDecoration="none" onClick={() => setTimerStatus("PAUSED")}>
          <FaPause boxSize={3} />
        </Button>
      )}

      {timerStatus === "PAUSED" && (
        <Button onClick={() => onOpen()}>
          <Icon as={FaListCheck} fontSize={16} />
        </Button>
      )}

      <InputGroup>
        <Input
          value={currentTimer}
          onChange={(e) => setCurrentTimer(e.target.value)}
          w="130px"
          disabled={timerStatus !== "STOPPED"}
        />
        <InputLeftElement>
          <TimeIcon />
        </InputLeftElement>
      </InputGroup>
    </Stack>
  );
}
