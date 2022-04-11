import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuppliersService } from './suppliers.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateSupplierTypeDto } from './dto/create-supplier-type.dto';
import { SupplierType } from './supplierType.entity';
import { GetSupplierTypeFilter } from './dto/get-supplier-type-filter.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Supplier } from './supplier.entity';

@Controller('suppliers')
@UseGuards(AuthGuard())
export class SuppliersController {
  private logger = new Logger('SuppliersController');
  constructor(private suppliersService: SuppliersService) {}

  @Post('')
  @HttpCode(201)
  createSupplier(
    @Body() createSupplierDto: CreateSupplierDto,
    @GetUser() user: User,
  ): Promise<Supplier> {
    this.logger.verbose(
      `User "${user.username}", create a new supplier. 
       data: ${JSON.stringify(createSupplierDto)}`,
    );
    return this.suppliersService.createSupplier(createSupplierDto, user);
  }

  @Get('/:id')
  getSupplier(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<Supplier> {
    this.logger.verbose(
      `User "${user.username}", retrieving supplier by id ${id}`,
    );
    return this.suppliersService.getSupplier(id, user);
  }

  @Get()
  getSupplierTypes(
    @Query() filterDto: GetSupplierTypeFilter,
    @GetUser() user: User,
  ): Promise<SupplierType[]> {
    this.logger.verbose(
      `User "${user.username}", retrieving all supplier types. 
       filters: ${JSON.stringify(filterDto)}`,
    );
    return this.suppliersService.getSupplierTypes(filterDto, user);
  }

  @Get('/:id')
  getSupplierType(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<SupplierType> {
    this.logger.verbose(
      `User "${user.username}", retrieving supplier type. 
       id: ${id}`,
    );
    return this.suppliersService.getSupplierType(id, user);
  }

  @Post('/type')
  @HttpCode(201)
  createSupplierType(
    @Body() createSupplierTypeDto: CreateSupplierTypeDto,
    @GetUser() user: User,
  ): Promise<SupplierType> {
    this.logger.verbose(
      `User "${user.username}", create a new supplier type. 
       data: ${JSON.stringify(createSupplierTypeDto)}`,
    );
    return this.suppliersService.createSupplierType(
      createSupplierTypeDto,
      user,
    );
  }

  @Put('/type/:id')
  @HttpCode(204)
  editSupplierType(
    @Param('id') id: string,
    @Body() createSupplierTypeDto: CreateSupplierTypeDto,
    @GetUser() user: User,
  ): Promise<SupplierType> {
    this.logger.verbose(
      `User "${user.username}", update a new supplier type. 
       data: ${JSON.stringify(createSupplierTypeDto)}`,
    );
    return this.suppliersService.updateSupplierType(
      id,
      createSupplierTypeDto,
      user,
    );
  }
}
