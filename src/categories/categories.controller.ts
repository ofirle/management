import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { GetUser } from '../auth/get-user.decorator';
import { createCategoryDto } from './dto/create-category.dto';
import { ActionsEnum } from '../shared/enum';
import { User } from '../auth/auth.entity';

@Controller('categories')
@UseGuards(AuthGuard())
export class CategoriesController {
  private logger = new Logger('Categories Controller');

  constructor(private categoriesService: CategoriesService) {}

  @Post('')
  @HttpCode(201)
  async createCategory(
    @Body() data: createCategoryDto,
    @GetUser({ actions: ActionsEnum.CreateCategory }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", create a new category. 
       data: ${JSON.stringify(data)}`,
    );
    try {
      const category = await this.categoriesService.createCategory(data, user);
      return {
        data: category,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async getCategory(
    @GetUser({ actions: ActionsEnum.ReadCategory }) user: User,
    @Param('id') id: string,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", retrieving category by id ${id}`,
    );
    try {
      const category = await this.categoriesService.getCategory(
        Number(id),
        user,
      );
      return {
        data: category,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/')
  async getCategories(
    @GetUser({ actions: ActionsEnum.ReadCategories }) user: User,
  ): Promise<any> {
    this.logger.verbose(`User "${user.username}", retrieving categories`);
    try {
      const categories = await this.categoriesService.getCategories(user);
      return {
        data: categories,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
