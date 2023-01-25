import axios from 'axios';

import { ALL_INVOICES_QUERY } from '../../graphql/queries';
import { DM_ENDPOINT, HASURA_SECRET } from '../../config';

const handler = async (req, res) => {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (req.method === 'POST') {
    try {
      const graphqlQuery = {
        operationName: 'allInvoices',
        query: ALL_INVOICES_QUERY(),
        variables: {}
      };

      const { data } = await axios.post(`${DM_ENDPOINT}`, graphqlQuery, {
        headers: {
          'x-hasura-admin-secret': HASURA_SECRET
        }
      });

      res.status(201).json(data.data.raids);
    } catch (err) {
      console.error(err);
      res.status(500).json('Internal server error');
    }
  }
};

export default handler;
