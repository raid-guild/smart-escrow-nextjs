import { Flex } from '@chakra-ui/react';

import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = ({ children }) => {
  return (
    <Flex
      minH='100vh'
      position='relative'
      direction='column'
      justify='space-between'
      align='center'
      background='radial-gradient(97.27% 170.54% at 98.7% 2.73%, #24003A 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(100% 350.19% at 100% 100%, #170011 0%, rgba(23, 0, 17, 0) 100%),
        radial-gradient(50% 175.1% at 0% 100%, #130000 0%, rgba(31, 0, 0, 0) 100%),
        radial-gradient(50% 175.1% at 0% 0%, #330F00 0%, rgba(51, 15, 0, 0) 100%),
        linear-gradient(0deg, #000000, #000000)'
      color='red'
      overflowY='scroll'
    >
      <Header />
      <Flex maxW='100rem' w='100%' direction='column' alignItems='center'>
        {children}
        <br />
      </Flex>
      <Footer />
    </Flex>
  );
};
