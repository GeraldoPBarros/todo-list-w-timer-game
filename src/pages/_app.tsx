import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Header } from "../components/Header";

import { useRouter } from "next/router";

import { theme } from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  return (
    <ChakraProvider theme={theme}>
      {pathname !== "/" && <Header />}

      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
