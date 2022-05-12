import axios from 'axios';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (req.method === 'POST') {
    try {
      const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: 5 * 60 });
      const { data } = await axios.patch(
        `${process.env.DM_ENDPOINT}/update/raid/${req.body.raidId}`,
        {
          invoice_address: req.body.invoiceAddress
        },
        {
          headers: {
            authorization: 'Bearer ' + token
          }
        }
      );

      res.status(201).json(data.data);
    } catch (err) {
      console.error(err);
      res.status(500).json('Internal server error');
    }
  }
};

export default handler;
