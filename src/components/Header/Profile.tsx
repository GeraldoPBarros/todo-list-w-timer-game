import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export default function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Geraldo Barros</Text>
          <Text color="gray.300" fontSize="small">
            geraldo.barros20@gmail.com
          </Text>
        </Box>
      )}

      <Avatar
        size="md"
        name="Geraldo Barros"
        src="https://github.com/GeraldoPBarros.png"
      />
    </Flex>
  );
}
