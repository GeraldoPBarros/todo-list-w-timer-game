import { AppProps } from "next/app";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Header } from "../components/Header";

import { useRouter } from "next/router";

import { theme } from "../styles/theme";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      {pathname !== "/" && <Header />}
      <Flex direction="column" h="100vh">
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          {pathname !== "/" && <Sidebar />}
          <Component {...pageProps} />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default MyApp;
