import { Connection } from 'mongoose';
import { TwitterSchema } from '../schemas/twitter.schema';

export const twitterProviders = [
  {
    provide: 'TWITTER_MODEL',
    useFactory: (connection: Connection) => connection.model('Twitter', TwitterSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
