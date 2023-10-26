import { api } from "@/services/api";
import { useContext, createContext, ReactNode, useState } from "react";

interface Rewards {
  data: {
    time: string;
    date: string;
  };
}

type TimerContextData = {
  currentRewards: Rewards[];
  getRewards: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const TimerContext = createContext({} as TimerContextData);

export function RewardsProvider({ children }: AuthProviderProps) {
  const [currentRewards, setCurrentRewards] = useState<Rewards[]>([]);

  async function getRewards() {
    const responseRewards = await api.get("api/rewards/manage_rewards");
    setCurrentRewards(responseRewards.data.rewards.data);
  }

  return (
    <TimerContext.Provider
      value={{
        currentRewards,
        getRewards,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export const useRewardsContext = () => useContext(TimerContext);
