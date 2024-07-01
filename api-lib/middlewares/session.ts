import { NextApiRequest, NextApiResponse } from 'next';
import { getMongoClient } from '@/api-lib/mongodb';
import MongoStore from 'connect-mongo';
import nextSession from 'next-session';
import { promisifyStore } from 'next-session/lib/compat';

const mongoStore = MongoStore.create({
  clientPromise: getMongoClient(), // This should return a Promise<mongodb.MongoClient>
  stringify: false,
});

const getSession = nextSession({
  store: promisifyStore(mongoStore),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 2 * 7 * 24 * 60 * 60 * 1000, // 2 weeks in milliseconds
    path: '/',
    sameSite: 'strict' as const, // Ensuring strict type for cookie setting
  },
  touchAfter: 1 * 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
});

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
): Promise<void> {
  await getSession(req, res);
  next();
}
