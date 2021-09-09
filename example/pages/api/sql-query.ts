import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let pool;
  try {
    if (!req.body?.query) throw { message: 'invalid query' };

    const { query } = req.body;
    pool = new Pool({
      connectionString: process.env.NEXT_PUBLIC_CONNECTION_STRING,
    });
    const { rows } = await pool.query(query);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ error });
  } finally {
    // clean up pg pool
    if (pool) {
      pool.end().then(() => console.log('pool has ended'));
    }
  }
};
