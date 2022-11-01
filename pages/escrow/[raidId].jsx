/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import { ethers, utils } from 'ethers';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Head from 'next/head';

import { AppContext } from '../../context/AppContext';

import { ProjectInfo } from '../../components/ProjectInfo';
import { InvoicePaymentDetails } from '../../components/InvoicePaymentDetails';
import { InvoiceMetaDetails } from '../../components/InvoiceMetaDetails';
import { InvoiceButtonManager } from '../../components/InvoiceButtonManager';

import { getInvoice } from '../../graphql/getInvoice';
import {
  getSmartInvoiceAddress,
  getRaidPartyAddress
} from '../../utils/invoice';
import { rpcUrls } from '../../utils/constants';
import { Page404 } from '../../shared/Page404';

export const getStaticPaths = async () => {
  const query = `query fetchRaids { raids { _id } }`;

  const graphqlQuery = {
    operationName: 'fetchRaids',
    query: query,
    variables: {}
  };

  const token = jwt.sign({}, process.env.JWT_SECRET);

  const { data } = await axios.post(
    `${process.env.DM_ENDPOINT}/graphql`,
    graphqlQuery,
    {
      headers: {
        authorization: 'Bearer ' + token
      }
    }
  );

  const paths = data.data.raids.map((raid) => {
    return {
      params: { raidId: raid._id.toString() }
    };
  });

  return {
    paths,
    fallback: true
  };
};

export const getStaticProps = async (context) => {
  const { raidId } = context.params;

  const query = `query validateRaidId { 
    raid(_id: "${raidId}") { 
    _id
    invoice_address
    raid_name
    start_date
    end_date
    consultation {
      contact_name
    }
}}`;

  const graphqlQuery = {
    operationName: 'validateRaidId',
    query: query,
    variables: {}
  };

  const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: 5 * 60 });
  const { data } = await axios.post(
    `${process.env.DM_ENDPOINT}/graphql`,
    graphqlQuery,
    {
      headers: {
        authorization: 'Bearer ' + token
      }
    }
  );

  let invoice;
  try {
    if (data.data.raid.invoice_address) {
      let smartInvoice = await getSmartInvoiceAddress(
        data.data.raid.invoice_address,
        new ethers.providers.JsonRpcProvider(rpcUrls[100])
      );
      invoice = await getInvoice(100, smartInvoice);
    }
  } catch (e) {
    console.log(e);
  }

  return {
    props: {
      raid: data.data.raid,
      escrowValue: invoice ? invoice.total : null,
      terminationTime: invoice ? invoice.terminationTime : null
    },
    revalidate: 1
  };
};

export default function Escrow({ raid, escrowValue, terminationTime }) {
  const context = useContext(AppContext);

  const [invoice, setInvoice] = useState();
  const [raidParty, setRaidParty] = useState('');
  const [invoiceFetchError, setInvoiceFetchError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState(
    'Invoice found for this Raid ID. Connect your wallet to fetch invoice information.'
  );

  const [validRaid, setValidRaid] = useState(false);

  useEffect(() => {
    if (raid) {
      context.setDungeonMasterContext({
        invoice_id: raid.invoice_address,
        raid_id: raid._id,
        project_name: raid.raid_name,
        client_name: raid.consultation.client_name,
        start_date: new Date(Number(raid.start_date)) || 'Not Specified',
        end_date: new Date(Number(raid.end_date)) || 'Not Specified',
        link_to_details: 'Not Specified',
        brief_description: 'Not Specified'
      });

      if (raid.invoice_address) {
        setValidRaid(true);
      }
    }
  }, []);

  const getSmartInvoiceData = async () => {
    try {
      if (
        utils.isAddress(context.invoice_id) &&
        !Number.isNaN(parseInt(context.chainID))
      ) {
        setLoading(true);
        setStatusText('Fetching Smart Invoice from Wrapped Invoice..');
        let smartInvoice = await getSmartInvoiceAddress(
          context.invoice_id,
          context.provider
        );

        const invoice = await getInvoice(
          parseInt(context.chainID),
          smartInvoice
        );
        setInvoice(invoice);
        setInvoiceFetchError(false);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setInvoiceFetchError(true);
      setStatusText('Wrong network. Please switch to the correct network.');
      setLoading(false);
    }
  };

  const fetchRaidPartyAddress = async () => {
    if (invoice) {
      let addr = await getRaidPartyAddress(invoice.provider, context.provider);
      setRaidParty(addr);
    }
  };

  useEffect(() => {
    if (context.invoice_id) {
      getSmartInvoiceData();
    }
  }, [context.invoice_id, context.chainID]);

  useEffect(() => {
    fetchRaidPartyAddress();
  }, [invoice]);

  return (
    <Flex w='100%' h='100%' justifyContent='center'>
      {escrowValue && (
        <Head>
          <title>{raid.raid_name}</title>
          <meta
            property='og:image'
            content={`https://smart-escrow-nextjs-git-develop-manolingam.vercel.app/api/og?projectName=${
              raid.raid_name
            }&escrowValue=${utils.parseEther(
              escrowValue
            )}&safetyValveDate=${terminationTime}`}
          />
        </Head>
      )}

      {validRaid ? (
        <>
          {context.account === '' && (
            <Flex direction='column' alignItems='center'>
              <Text variant='textOne'>{statusText}</Text>
              <Button
                w='350px'
                variant='primary'
                onClick={context.connectAccount}
                isLoading={loading}
              >
                Connect Wallet
              </Button>
            </Flex>
          )}

          {!invoice && invoiceFetchError && (
            <Text variant='textOne'>{statusText}</Text>
          )}

          {invoice && !loading && context.web3 && (
            <Flex
              width='100%'
              direction={{ md: 'column', lg: 'row' }}
              alignItems='center'
              justifyContent='space-evenly'
            >
              <Flex direction='column' minW='30%'>
                <ProjectInfo context={context} />
                <InvoiceMetaDetails invoice={invoice} raidParty={raidParty} />
              </Flex>

              <Flex direction='column' minW='45%'>
                <InvoicePaymentDetails
                  web3={context.web3}
                  invoice={invoice}
                  chainID={context.chainID}
                  provider={context.provider}
                />

                <InvoiceButtonManager
                  invoice={invoice}
                  account={context.account}
                  provider={context.provider}
                  raidParty={raidParty}
                  wrappedAddress={context.invoice_id}
                />
              </Flex>
            </Flex>
          )}
        </>
      ) : (
        <Page404 />
      )}
    </Flex>
  );
}
