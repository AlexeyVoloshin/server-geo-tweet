import { Inject, Injectable } from '@nestjs/common';
import * as Twitter from 'twit';
import { GeoInterface } from '../interfaces/geo.interface';

import { Model } from 'mongoose';
import { CreateGeoDto } from '../dto/create-geo.dto';
import { CreateTwitterDto } from '../dto/create-twitter.dto';

import { TwitterInterface } from '../interfaces/twitter.interface';

// tslint:disable-next-line:no-var-requires
const  cron = require('node-cron');

@Injectable()
export class AdminService {
  client = new Twitter({
    consumer_key: 'HMPy9UmDJcELYhdWssf00llNa',
    consumer_secret: 'FJf2n8szMnnhrBqtk7UpabgMSlPZdEmrtxSGRr4tcp7oPh1M45',
    access_token: '1007140982863876096-NbmEzEiLBweDAjpLGhemP4cQNjmkma',
    access_token_secret: 'C4FhG6BOPdNmywe9FZBOmcrywReDI4lamD5HZsfSR9z7k',
  });

  twitters: TwitterInterface[] = [];

  constructor(
    @Inject('GEO_MODEL') private readonly geoModel: Model<GeoInterface>,
    @Inject('TWITTER_MODEL') private readonly twitterModel: Model<TwitterInterface>,
  ) {}

  async get(req, res?): Promise<CreateTwitterDto> { // get tweets from twitter
    const rad = Math.round(req.body.rad / 1000);
    const loc = req.body.lat + ',' + req.body.lng + ',' + rad + 'km';
    const search = req.body.search;
    const params = { q: search, geocode: loc, count: 10 };

    return await this.client.get('search/tweets', params)
      .then(data => {
        data['data']['statuses'].map(value => {
          this.twitters.push({
            name: value.user.name,
            image: value.user.profile_image_url,
            location: value.user.location,
            text: value.text,
          });
        });
        res.send(this.twitters);
      })
      .catch(error => {
        res.send(error);
      });
  }

  async getTweets(): Promise<TwitterInterface> { // get tweets from local db
    return await this.twitterModel.find({}).sort({ _id: -1 });
  }

  async saveTwitters(createTwitter: CreateTwitterDto): Promise<TwitterInterface> {
    try {
      const createTwitterDto = new this.twitterModel();
      createTwitterDto.collection.insert(createTwitter);
      return await createTwitterDto.save();
    } catch (err) {
      console.log('saveTweets', err);
    }
  }

  async saveGeo(createGeo: CreateGeoDto): Promise<GeoInterface> {
    const createGeoDto = new this.geoModel(createGeo);
    const result = await createGeoDto.save();
    // this.cronJob();
    return result;
  }

  async getLastGeo(): Promise<GeoInterface> {
    return await this.geoModel.find().sort({ _id: -1 }).limit(1);
  }

  async getTweetsForCron(data: CreateGeoDto): Promise<CreateTwitterDto> {
    const rad = Math.round(data[0]['_doc'].rad / 1000);
    const loc = data[0]['_doc'].lat + ',' + data[0]['_doc'].lng + ',' + rad + 'km';
    const search = data[0]['_doc'].search;
    const params = { q: search, geocode: loc, count: 10 };
    return await this.client.get('search/tweets', params)
      .then(tweet => {
        tweet['data']['statuses'].map(value => {
          this.twitters.push({
            name: value.user.name,
            image: value.user.profile_image_url,
            location: value.user.location,
            text: value.text,
          });
        });
        return this.twitters;
      })
      .catch(error => {
        console.log(error);
      });
  }

  async saveNewTweets() {
    const geo = await this.getLastGeo();
    const newTweets = await this.getTweetsForCron(geo);
    await this.saveTwitters(newTweets);
  }

  cronJob() {
    cron.schedule('*/1 * * * *', async () => {
      try {
        console.log('Cron run: save new tweets');
        await this.saveNewTweets();
      } catch (error) {
        console.log('cron run saved new tweets error: ', error);
        throw  error;
      }
    });
   }
}
