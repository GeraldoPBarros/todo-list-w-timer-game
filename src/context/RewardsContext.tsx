import { useContext, createContext, ReactNode, useState } from "react";

interface Rewards {
  data: {
    time: string;
    date: string;
  };
}

type TimerContextData = {
  currentRewards: Rewards[];
  setCurrentRewards: (rewards: Rewards[]) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const TimerContext = createContext({} as TimerContextData);

export function RewardsProvider({ children }: AuthProviderProps) {
  const [currentRewards, setCurrentRewards] = useState<Rewards[]>([]);

  return (
    <TimerContext.Provider
      value={{
        currentRewards,
        setCurrentRewards,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useRewardsContext = () => useContext(TimerContext);
