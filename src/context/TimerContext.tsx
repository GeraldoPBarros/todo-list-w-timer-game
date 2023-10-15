import { useContext, createContext, ReactNode, useState } from "react";

type TimerContextData = {
  currentTimer: string;
  isTimerRunning: boolean;
  setCurrentTimer: (time: string) => void;
  setIsTimerRunning: (flag: boolean) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const TimerContext = createContext({} as TimerContextData);

export function TimerProvider({ children }: AuthProviderProps) {
  const [currentTimer, setCurrentTimer] = useState<string>("Select");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  return (
    <TimerContext.Provider
      value={{
        currentTimer,
        isTimerRunning,
        setCurrentTimer,
        setIsTimerRunning,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useTimerContext = () => useContext(TimerContext);
