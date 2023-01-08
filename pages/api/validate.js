import axios from 'axios';
import { DM_ENDPOINT, HASURA_SECRET } from '../../config';
import {
  RAID_BY_V1_ID_QUERY,
  RAID_BY_V2_ID_QUERY
} from '../../graphql/queries';

const handler = async (req, res) => {
  const { method } = req;

  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  if (req.method === 'POST') {
    try {
      const graphqlQuery = {
        operationName: 'validateRaidId',
        query:
          req.body.escrowVersion === 'Dungeon Master V1'
            ? RAID_BY_V1_ID_QUERY(req.body.raidId)
            : RAID_BY_V2_ID_QUERY(req.body.raidId),
        variables: {}
      };

      const { data } = await axios.post(`${DM_ENDPOINT}`, graphqlQuery, {
        headers: {
          'x-hasura-admin-secret': HASURA_SECRET
        }
      });

      res.status(201).json(data.data ? data.data.raids[0] : null);
    } catch (err) {
      console.error(err);
      res.status(500).json('Internal server error');
    }
  }
};

export default handler;
