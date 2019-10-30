import { Document } from 'mongoose';
export interface GeoInterface extends Document {
  readonly lat: string;
  readonly lng: string;
  readonly rad: string;
  readonly search: string;
}
