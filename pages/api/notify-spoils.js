import axios from 'axios';
import jwt from 'jsonwebtoken';
import { MINISTER_SENTRY_ENDPOINT } from '../../config';

const handler = async (req, res) => {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (req.method === 'POST') {
    let { token, raidPartyShare, guildShare, txLink } = req.body;
    try {
      const { data } = await axios.post(
        `${MINISTER_SENTRY_ENDPOINT}/escrow/notify-spoils`,
        {
          token,
          raidPartyShare,
          guildShare,
          txLink
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
