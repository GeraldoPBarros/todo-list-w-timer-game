import { api } from "@/services/api";
import { calculateParticipantLevel } from "@/utils/levelSystem";
import { getLastRewardInfo } from "@/utils/timerOptions";
import { useEffect } from "react";
import { useContext, createContext, ReactNode, useState } from "react";

interface Rewards {
  data: {
    time: string;
    date: string;
  };
}

type NotificationsType = {
  time: string | undefined;
  increasedExperience: string;
};

type UpdateRewardsType = "UPDATE" | "NOTHING";

type RewardsContextData = {
  currentRewards: Rewards[];
  notifications: NotificationsType[];
  setNotifications: (data: NotificationsType[]) => void;
  getRewards: (type: UpdateRewardsType) => void;
  updateNotifications: (rewards: Rewards[]) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const RewardsContext = createContext({} as RewardsContextData);

export function RewardsProvider({ children }: AuthProviderProps) {
  const [currentRewards, setCurrentRewards] = useState<Rewards[]>([]);
  const [notifications, setNotifications] = useState<NotificationsType[]>([]);

  async function getRewards(type: UpdateRewardsType) {
    const responseRewards = await api.get("api/rewards/manage_rewards");
    setCurrentRewards(responseRewards.data.rewards.data);
    if (type === "UPDATE") {
      updateNotifications(responseRewards.data.rewards.data);
    }
  }

  function updateNotifications(rewards: Rewards[]) {
    if (rewards?.length > 0) {
      let lastArrPercentage = rewards.filter(
        (item, index) => index !== rewards.length - 1
      );

      const percentageToNextLvl = calculateParticipantLevel(rewards);
      const lastPercentage = calculateParticipantLevel(lastArrPercentage);

      setNotifications([
        {
          time: getLastRewardInfo(rewards[rewards.length - 1].data.time),
          increasedExperience:
            (percentageToNextLvl[1] - lastPercentage[1]).toFixed(2) + "%",
        },
      ]);
    }
  }

  return (
    <RewardsContext.Provider
      value={{
        currentRewards,
        notifications,
        setNotifications,
        getRewards,
        updateNotifications,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export const useRewardsContext = () => useContext(RewardsContext);
