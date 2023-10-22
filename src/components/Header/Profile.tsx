import { Avatar, Flex, Text } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

interface ProfileProps {
  showProfileData?: boolean;
  participantLvl?: string;
  percentageNextLvl?: string;
}

export default function Profile({ showProfileData = true }: ProfileProps) {
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
            Level 1: 50%
          </Text>
        </Flex>
      )}

      <Avatar
        size="md"
        name="Geraldo Barros"
        src="https://github.com/GeraldoPBarros.png"
      />
    </Flex>
  );
}
