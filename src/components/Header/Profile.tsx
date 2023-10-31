import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

import { useRewardsContext } from "../../context/RewardsContext";

import { calculateParticipantLevel } from "../../utils/levelSystem";

import { useEffect, useState } from "react";
import { MdOutlineExitToApp, MdSettings } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";

interface ProfileProps {
  showProfileData?: boolean;
  participantLvl?: string;
  percentageNextLvl?: string;
}

export default function Profile({ showProfileData = true }: ProfileProps) {
  const { currentRewards } = useRewardsContext();
  const [percentageLevel, setPercentageLevel] = useState<string>("");
  const [participantLevel, setParticipantLevel] = useState<string>("");

  const { signOut } = useAuth();

  useEffect(() => {
    if (currentRewards?.length > 0) {
      const percentageToNextLvl = calculateParticipantLevel(currentRewards);
      setPercentageLevel(percentageToNextLvl[1].toFixed(2) + "%");
      setParticipantLevel(`${percentageToNextLvl[0]}`);
    }
  }, [currentRewards]);

  return (
    <Flex align="center">
      {showProfileData && (
        <Flex
          mr="4"
          direction="column"
          textAlign="right"
          justifyContent="center"
        >
          <Text>Geraldo Barros</Text>
          <Text color="gray.300" fontSize="small">
            <StarIcon boxSize={3} pb={1} />
            {`Lvl ${participantLevel}: ${percentageLevel}`}
          </Text>
        </Flex>
      )}
      <Menu>
        <MenuButton>
          <Avatar
            size="md"
            name="Geraldo Barros"
            src="https://github.com/GeraldoPBarros.png"
          />
        </MenuButton>
        <MenuList w={100}>
          <MenuItem icon={<MdSettings />} color={"gray.200"}>
            User Settings
          </MenuItem>
          <MenuItem icon={<MdOutlineExitToApp />} onClick={() => signOut()}>
            Sign Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
