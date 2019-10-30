import { Connection } from 'mongoose';
// import { UserSchema } from '../schemas/user.schema';
import { GeoSchema } from '../schemas/geo.schema';

export const geoProviders = [
  {
    provide: 'GEO_MODEL',
    useFactory: (connection: Connection) => connection.model('Geo', GeoSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
