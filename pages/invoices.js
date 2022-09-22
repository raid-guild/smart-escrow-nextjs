/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import {
  VStack,
  SimpleGrid,
  Text,
  Flex,
  Button,
  NumberInput,
  NumberInputField
} from '@chakra-ui/react';
import { Contract, providers, utils } from 'ethers';
import Link from 'next/link';

import { Loader } from '../components/Loader';
import { AppContext } from '../context/AppContext';
import { allInvoices } from '../utils/requests';
import {
  rpcUrls,
  NETWORK_CONFIG,
  RAIDGUILD_DAO_MIN_SHARES
} from '../utils/constants';

const RECORDS_PER_PAGE = 9;

export default function Home() {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const [isMember, setIsMember] = useState(false);

  const [invoices, setInvoices] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentRecords, setCurrentRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const validateMembership = async (_address) => {
    setLoading(true);
    const gnosisEthersProvider = new providers.JsonRpcProvider(rpcUrls[100]);
    const abi = new utils.Interface([
      'function members(address account) view returns (address, uint256, uint256, bool, uint256, uint256)'
    ]);
    const contract = new Contract(
      NETWORK_CONFIG.RG_XDAI,
      abi,
      gnosisEthersProvider
    );
    const member = await contract.members(_address.toLowerCase());
    if (Number(member[1]) >= RAIDGUILD_DAO_MIN_SHARES) {
      setIsMember(true);
    } else {
      setIsMember(false);
    }
    setLoading(false);
  };

  const fetchInvoices = async () => {
    setLoading(true);
    const invoices = await allInvoices();
    let sanitizedInvoices = [];
    invoices.map((invoice) => {
      invoice.invoice_address !== '' && sanitizedInvoices.push(invoice);
    });
    setInvoices(sanitizedInvoices);
    cropRecords(sanitizedInvoices, 1);
    setLoading(false);
  };

  const paginate = (_records, _pageNumber) => {
    _pageNumber ? setCurrentPage(_pageNumber) : null;
    const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
    const currentRecords = _records.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );

    setCurrentRecords(currentRecords);
  };

  const cropRecords = (_invoices, _page) => {
    setTotalPages(Math.ceil(_invoices.length / RECORDS_PER_PAGE));
    paginate(_invoices, _page);
  };

  useEffect(() => {
    if (context.account !== '') {
      setInvoices([]);
      setCurrentRecords([]);
      validateMembership(context.account);
    }
  }, [context.account]);

  useEffect(() => {
    isMember && fetchInvoices();
  }, [isMember]);

  useEffect(() => {
    invoices && cropRecords(invoices);
  }, [currentPage]);

  return (
    <VStack>
      {context.account === '' && (
        <Text fontFamily='spaceMono' color='red'>
          Connect your wallet to validate membership!
        </Text>
      )}

      {context.account && loading && <Loader />}

      {!loading && context.account && !isMember && (
        <Text fontFamily='spaceMono' color='red'>
          Not a member!
        </Text>
      )}

      {!loading && isMember && (
        <>
          <SimpleGrid columns='3' w='100%' my='2rem' gap='1rem'>
            {currentRecords.map((record, index) => {
              return (
                <Link key={index} href={`/escrow/${record._id}`} passHref>
                  <Flex
                    p='1rem'
                    fontFamily='spaceMono'
                    justifyContent='space-between'
                    border='2px solid'
                    borderColor='white'
                    color='white'
                    cursor='pointer'
                    _hover={{
                      backgroundColor: 'white',
                      color: 'black'
                    }}
                    my='5px'
                  >
                    <Text>{record.raid_name}</Text>
                  </Flex>
                </Link>
              );
            })}
          </SimpleGrid>

          {totalPages > 0 && (
            <Flex direction='row' mt='2rem'>
              <Button
                bg='red'
                mr='1rem'
                fontFamily='spaceMono'
                disabled={currentPage - 1 == 0}
                onClick={() => setCurrentPage((currentPage) => currentPage - 1)}
                _hover={{
                  opacity: currentPage - 1 == 0 ? 0.5 : 0.8
                }}
                color='black'
              >
                Prev
              </Button>
              <NumberInput
                w='150px'
                max={totalPages}
                onChange={(e) => {
                  if (Number(e) > 0 && Number(e) <= totalPages) {
                    setCurrentPage(Number(e));
                  }
                }}
              >
                <NumberInputField
                  h='100%'
                  border='2px solid'
                  borderColor='red'
                  borderRadius='3px'
                  fontFamily='spaceMono'
                  color='red'
                  placeholder='Go to page'
                />
              </NumberInput>
              <Button
                bg='red'
                ml='1rem'
                fontFamily='spaceMono'
                color='black'
                disabled={currentPage + 1 > totalPages}
                onClick={() => setCurrentPage((currentPage) => currentPage + 1)}
                _hover={{
                  opacity: currentPage + 1 > totalPages ? 0.5 : 0.8
                }}
              >
                Next
              </Button>
            </Flex>
          )}

          {totalPages > 0 && (
            <Text fontFamily='spaceMono' mt='2rem'>
              Page {currentPage} of {totalPages}
            </Text>
          )}
        </>
      )}
    </VStack>
  );
}
