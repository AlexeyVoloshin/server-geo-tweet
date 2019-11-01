import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as Twitter from 'twit';
import { GeoInterface } from '../interfaces/geo.interface';
import { User } from '../interfaces/user.interface';
import { Model } from 'mongoose';
import { CreateGeoDto } from '../dto/create-geo.dto';
import { CreateTwitterDto } from '../dto/create-twitter.dto';
import { map } from 'rxjs/operators';
import { TwitterInterface } from '../interfaces/twitter.interface';
import { Observable } from 'rxjs';
import { ScheduleService } from '../helpers/schedule-service';
import { InjectSchedule, Schedule } from 'nest-schedule';

@Injectable()
export class AdminService {
  client = new Twitter({
    consumer_key: 'HMPy9UmDJcELYhdWssf00llNa',
    consumer_secret: 'FJf2n8szMnnhrBqtk7UpabgMSlPZdEmrtxSGRr4tcp7oPh1M45',
    access_token: '1007140982863876096-NbmEzEiLBweDAjpLGhemP4cQNjmkma',
    access_token_secret: 'C4FhG6BOPdNmywe9FZBOmcrywReDI4lamD5HZsfSR9z7k',
  });
  geoInterfaces: CreateGeoDto;
  twitters: CreateTwitterDto;
  twitt: CreateTwitterDto[] = [];

  constructor(
    @Inject('GEO_MODEL') private readonly geoModel: Model<GeoInterface>,
    @Inject('TWITTER_MODEL') private readonly twitterModel: Model<TwitterInterface>,
    @InjectSchedule() private readonly schedule: Schedule,
  ) {
  }

  async get(req, res): Promise<TwitterInterface> {
    const radkm = Math.round(req.body.rad / 1000);
    const loc = req.body.lat + ',' + req.body.lng + ',' + radkm + 'km';
    console.log(loc);
    const w = req.body.w;
    const params = { q: w, geocode: loc, count: 10 };
    return await this.client.get('search/tweets', params)
      .then(timeline => {
        timeline['data']['statuses'].map(value => {
          this.twitters = {
            text: value.text,
            name: value.user.name,
            location: value.user.location,
            image: value.user.profile_image_url,
          };
          this.saveTwitters(this.twitters);
        });
        res.send('ok');
      })
      .catch(error => {
        res.send(error);
      });
  }

  async getTweets(): Promise<TwitterInterface> {
    return await this.twitterModel.find({}).sort({ _id: -1 });
  }

  async saveTwitters(createTwitter: CreateTwitterDto): Promise<TwitterInterface> {
    const createTwitterDto = new this.twitterModel(createTwitter);
    return await createTwitterDto.save();
  }

  async saveGeo(createGeo: CreateGeoDto): Promise<GeoInterface> {
    const createGeoDto = new this.geoModel(createGeo);
    return await createGeoDto.save();
  }

  async getLastGeo(): Promise<GeoInterface> {
    return await this.geoModel.find().sort({ _id: -1 }).limit(1);
  }

  onModuleInit(): any {
    this.schedule.scheduleIntervalJob('my-job', 2000, () => {
      console.log('executing interval job');
      this.getNewTweets();
      return true;
    });
  }

  async getNewTweets() {
    await this.getLastGeo().then(data => {
      debugger
      this.geoInterfaces = data[0]['_doc'];
      // return this.geoInterfaces;
    }).catch(error => {
      console.log(error);
    });
    const loc = this.geoInterfaces.lat + ',' + this.geoInterfaces.lng + ',' + this.geoInterfaces.rad + 'km';
    console.log(loc);
    const search = this.geoInterfaces.search;
    const params = { q: search, geocode: loc, count: 10 };
    return await this.client.get('search/tweets', params)
      .then(timeline => {
        debugger
        timeline['data']['statuses'].map(value => {
          this.twitt.push({
            text: value.text,
            name: value.user.name,
            location: value.user.location,
            image: value.user.profile_image_url,
          });
        });
        this.saveTwitters(this.twitters);
        console.log('ok');
      })
      .catch(error => {
        console.log(error);
      });
  }
}
