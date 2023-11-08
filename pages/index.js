import { useContext, useState } from 'react';
import {
	VStack,
	useToast,
	Box,
	Button,
	Text,
	Link,
	HStack,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { RadioBox } from '../components/RadioBox';

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

	const [escrowVersion, setEscrowVersion] = useState('Dungeon Master V2');

	const toast = useToast();

	const validateID = async () => {
		if (ID === '') return alert('ID cannot be empty!');
		context.updateLoadingState();

		let raid = await validateRaidId(ID, escrowVersion);
		if (raid) {
			context.setDungeonMasterContext({
				invoice_id: raid.invoice_address,
				v1_id: raid.v1_id,
				raid_id: raid.id,
				project_name: raid.name,
				client_name: raid.consultation.consultations_contacts[0].contact.name,
				start_date: new Date(Number(raid.start_date)) || 'Not Specified',
				end_date: new Date(Number(raid.end_date)) || 'Not Specified',
				link_to_details: 'Not Specified',
				brief_description: 'Not Specified',
			});

			setValidId(true);
		} else {
			toast({
				duration: 3000,
				position: 'top',
				render: () => (
					<Box color='white' p={3} mt='2rem' bg='#ff3864' fontFamily='jetbrains' textTransform='uppercase'>
						Raid ID not found or invalid.
					</Box>
				),
			});
		}
		context.updateLoadingState();
	};

	return (
		<VStack height='full'>
			<Alert
				status='warning'
				variant='subtle'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
				color='blackLighter'
				textAlign='center'
				mb='1rem'>
				<AlertIcon boxSize='40px' mr={0} />
				<AlertTitle mt={4} mb={1} fontSize='lg'>
					Heads Up!
				</AlertTitle>
				<AlertDescription maxWidth='sm' mb={4}>
					We&apos;ve changed things up! You can&apos;t create smart escrows here anymore. Click the button below to
					check out our new smart escrow site.
				</AlertDescription>
				<Link href='https://dm.raidguild.org/escrow' isExternal>
					<Button variant='secondary' size='sm'>
						Go
					</Button>
				</Link>
			</Alert>
			<HStack mb='1rem'>
				<StyledInput
					type='text'
					placeholder='Raid ID from Dungeon Master..'
					onChange={(event) => setID(event.target.value)}></StyledInput>

				{context.isLoading && (
					<span style={{ width: '50px' }}>
						<Loader />
					</span>
				)}

				{!context.isLoading && !validId ? (
					<Button
						variant='primary'
						onClick={validateID}
						disabled={!ID}
						_hover={{
							opacity: 0.8,
						}}>
						Validate ID
					</Button>
				) : (
					!context.isLoading &&
					context.account === '' && (
						<Button variant='primary' onClick={context.connectAccount}>
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
							<Button variant='primary'>View Escrow</Button>
						</Link>
					) : (
						<Link href='/new' passHref>
							<Button variant='primary'>Register Escrow</Button>
						</Link>
					))}
			</HStack>

			{/* <Flex
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
      </Flex> */}
		</VStack>
	);
}
