import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { createCategoryDto } from './dto/create-category.dto';
import { Category } from './categories.entity';

@Controller('categories')
@UseGuards(AuthGuard())
export class CategoriesController {
  private logger = new Logger('Categories Controller');

  constructor(private categoriesService: CategoriesService) {}

  @Post('')
  @HttpCode(201)
  createCategory(
    @Body() data: createCategoryDto,
    @GetUser() user: User,
  ): Promise<Category> {
    this.logger.verbose(
      `User "${user.username}", create a new category. 
       data: ${JSON.stringify(data)}`,
    );
    return this.categoriesService.createCategory(data, user);
  }

  @Get('/:id')
  getCategory(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<Category> {
    this.logger.verbose(
      `User "${user.username}", retrieving category by id ${id}`,
    );
    return this.categoriesService.getCategory(Number(id), user);
  }
}
