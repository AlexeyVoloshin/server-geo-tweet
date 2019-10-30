import { Body, Controller, Get, Req, Res, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GeoInterface } from '../interfaces/geo.interface';
import { CreateGeoDto } from '../dto/create-geo.dto';
import { TwitterInterface } from '../interfaces/twitter.interface';
import { Observable } from 'rxjs';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {
  }
  @Post('/save')
  async findAllAndSave(@Req() req: any, @Res() res: any): Promise<TwitterInterface> {
    return this.adminService.get(req, res);
  }
  @Get('/tweets')
  async findAll(): Promise<TwitterInterface> {
    return this.adminService.getTweets();
  }
  @Post('/geo')
  async createGeo(@Body() createGeoDto: CreateGeoDto) {
    await this.adminService.create(createGeoDto);
  }
  @Get('/geo')
  async findOneGeo(): Promise<GeoInterface> {
    return this.adminService.getLast();
  }

}
