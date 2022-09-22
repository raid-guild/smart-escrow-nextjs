import axios from 'axios';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (req.method === 'POST') {
    try {
      const query = `query allInvoices { 
            invoices { 
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
        operationName: 'allInvoices',
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

      res.status(201).json(data.data.invoices);
    } catch (err) {
      console.error(err);
      res.status(500).json('Internal server error');
    }
  }
};

export default handler;
