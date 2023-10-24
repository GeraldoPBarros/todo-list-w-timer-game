import { ChevronDownIcon, TimeIcon } from "@chakra-ui/icons";
import {
  Stack,
  Button,
  useDisclosure,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Flex,
} from "@chakra-ui/react";

import { format } from "date-fns";

import { FaPlay, FaPause } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";

import { useState, useEffect } from "react";

import { TimerModal } from "./TimerModal";
import { useTimerContext } from "@/context/TimerContext";
import { subtractTime } from "@/utils/subtractTime";
import { api } from "@/services/api";

import {
  time_to_select_lv1,
  time_on_timer_lv1,
} from "../../../utils/timerOptions";

interface Timer {}

type TimerStatus = "RUNNING" | "STOPPED" | "PAUSED";

let timer: NodeJS.Timeout;

export function Timer() {
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("STOPPED");
  const [initialTime, setInitialTime] = useState<string>("00:00:00");

  const { currentTimer, setCurrentTimer, setIsTimerRunning } =
    useTimerContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (timerStatus === "RUNNING") {
      setIsTimerRunning(true);
      setInitialTime(currentTimer);
    } else {
      setIsTimerRunning(false);
    }
  }, [timerStatus]);

  useEffect(() => {
    console.log("initialTime: ", initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (timerStatus == "RUNNING") {
      const [hours, minutes, seconds] = currentTimer.split(":").map(Number);

      if (hours === 0 && minutes === 0 && seconds === 0) {
        // Timer reached zero, stop the timer
        finishTimer("STOPPED");
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

  const finishTimer = (action: TimerStatus) => {
    setTimerStatus(action);
    const finalTime = subtractTime(initialTime, currentTimer);
    api.put("api/rewards/manage_rewards", {
      time: finalTime,
      date: format(new Date(), "dd, MMM yyyy pp"),
    });
    setCurrentTimer("Select");
  };

  return (
    <Stack direction={["row"]} spacing="8px">
      <TimerModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        currentTime={currentTimer}
        onEnd={finishTimer}
      />
      <Button
        textDecoration="none"
        disabled={timerStatus === "RUNNING"}
        onClick={() =>
          currentTimer !== "Select" ? setTimerStatus("RUNNING") : null
        }
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
          <FaPause boxSize={2} />
        </Button>
      )}

      {timerStatus === "RUNNING" && (
        <Button textDecoration="none" onClick={() => setTimerStatus("PAUSED")}>
          <FaPause boxSize={2} />
        </Button>
      )}

      {timerStatus === "PAUSED" && (
        <Button onClick={() => onOpen()}>
          <Icon as={FaListCheck} fontSize={16} />
        </Button>
      )}

      <Flex>
        <Menu>
          <MenuButton
            disabled={timerStatus !== "STOPPED"}
            bg={timerStatus !== "STOPPED" ? "gray.200" : "gray.100"}
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            <Stack direction="row" spacing={2} alignItems="center" w={85}>
              <TimeIcon />
              <Text>{currentTimer}</Text>
            </Stack>
          </MenuButton>
          {timerStatus === "STOPPED" && (
            <MenuList>
              {time_to_select_lv1.map((value: string, index: number) => (
                <MenuItem
                  onClick={() => setCurrentTimer(time_on_timer_lv1[index])}
                >
                  {value}
                </MenuItem>
              ))}
            </MenuList>
          )}
        </Menu>
      </Flex>
    </Stack>
  );
}
