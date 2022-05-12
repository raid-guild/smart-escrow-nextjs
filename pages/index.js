import { useContext, useState } from 'react';
import {
  VStack,
  useToast,
  Box,
  Button,
  Text,
  Flex,
  Heading,
  Link as ChakraLink
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import Link from 'next/link';

import { theme } from '../theme/theme';
import { Loader } from '../components/Loader';
import { AppContext } from '../context/AppContext';
import { validateRaidId } from '../utils/requests';

const StyledInput = styled.input`
  width: 400px;
  outline: none;
  color: white;
  font-family: ${theme.fonts.spaceMono};
  font-size: 1.1rem;
  border-radius: 3px;
  background-color: ${theme.colors.greyDark};
  margin-bottom: 15px;
  padding: 10px;
  &::placeholder {
    color: #ff3864;
    opacity: 0.5;
  }
`;

export default function Home() {
  const context = useContext(AppContext);
  const [ID, setID] = useState('');
  const [validId, setValidId] = useState(false);

  const toast = useToast();

  const validateID = async () => {
    if (ID === '') return alert('ID cannot be empty!');
    context.updateLoadingState();

    let raid = await validateRaidId(ID);
    if (raid) {
      context.setDungeonMasterContext({
        invoice_id: raid.invoice_address,
        raid_id: ID,
        project_name: raid.raid_name,
        client_name: raid.consultation.contact_name,
        link_to_details: 'Not Specified',
        brief_description: 'Not Specified'
      });

      setValidId(true);
      context.updateLoadingState();
    } else {
      toast({
        duration: 3000,
        position: 'top',
        render: () => (
          <Box
            color='white'
            p={3}
            mt='2rem'
            bg='#ff3864'
            fontFamily='jetbrains'
            textTransform='uppercase'
          >
            Raid ID not found or invalid.
          </Box>
        )
      });
    }
  };

  return (
    <VStack height='150px'>
      <StyledInput
        type='text'
        placeholder='Raid ID from Dungeon Master..'
        onChange={(event) => setID(event.target.value)}
      ></StyledInput>

      {context.isLoading && (
        <span style={{ width: '50px' }}>
          <Loader />
        </span>
      )}

      {!context.isLoading && !validId ? (
        <Button w='400px' variant='primary' onClick={validateID}>
          Validate ID
        </Button>
      ) : (
        !context.isLoading &&
        context.account === '' && (
          <Button w='400px' variant='primary' onClick={context.connectAccount}>
            Connect Wallet
          </Button>
        )
      )}

      {!context.isLoading &&
        context.account !== '' &&
        validId &&
        (Number(context.chainID) !== 100 && Number(context.chainID) !== 4 ? (
          <Text variant='textOne'>Unsupported Network</Text>
        ) : context.invoice_id ? (
          <Link href={`/escrow/${context.raid_id}`} passHref>
            <Button w='400px' variant='primary'>
              View Escrow
            </Button>
          </Link>
        ) : (
          <Link href='/new' passHref>
            <Button w='400px' variant='primary'>
              Register Escrow
            </Button>
          </Link>
        ))}

      <Flex
        direction='column'
        bgColor='white'
        borderRadius='0.5rem'
        p='0.5rem 1rem'
        maxW='400px'
      >
        <Text
          fontSize={{ base: '1rem', lg: '18px' }}
          fontWeight='bold'
          fontFamily={theme.fonts.spaceMono}
          color='black'
          mb='.5rem'
        >
          IMPORTANT
        </Text>
        <Text
          fontSize={{ base: '1rem', lg: '16px' }}
          fontFamily={theme.fonts.spaceMono}
          color='black'
        >
          If you created an escrow prior to May 12, 2022, please use the older
          version of the Smart Escrow:{' '}
          <ChakraLink
            href='https://smartescrow-legacy.raidguild.org'
            isExternal
            textDecoration='underline'
            color='red'
          >
            smartescrow-legacy.raidguild.org
          </ChakraLink>
        </Text>
      </Flex>
    </VStack>
  );
}
