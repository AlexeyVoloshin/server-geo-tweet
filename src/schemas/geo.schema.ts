import * as mongoose from 'mongoose';

export const GeoSchema = new mongoose.Schema({
  lat: {
    type: String,
    require: true,
  },
  lng: {
    type: String,
    require: true,
  },
  rad: {
    type: String,
    require: true,
  },
  search: {
    type: String,
    require: false,
  },
});
