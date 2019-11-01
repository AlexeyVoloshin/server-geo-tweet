import * as mongoose from 'mongoose';

export const TwitterSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    require: false,
  },
  location: {
    type: String,
    require: false,
  },
  image: {
    type: String,
    require: false,
  },
});
