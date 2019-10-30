import { Document } from 'mongoose';
export interface TwitterInterface extends Document {
  readonly name: string;
  readonly text: string;
  readonly location: string;
  readonly image: string;
}
