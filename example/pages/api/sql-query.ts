import type { NextApiRequest, NextApiResponse } from 'next';
const { Pool } = require('pg');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body?.query) throw { message: 'invalid query' };

    const { query } = req.body;
    const pool = new Pool({
      connectionString: process.env.NEXT_PUBLIC_CONNECTION_STRING,
    });
    const { rows } = await pool.query(query);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ error });
  }
};
