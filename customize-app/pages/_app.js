import "../styles/globals.css"
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"

const MyApp = ({ Component, pageProps }) => {

  const theme = extendTheme({
    styles: {
      global: () => ({
        body: {
          bg: "",
        },
      }),
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
