import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { SchemaFactory } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: SchemaFactory.createForClass(Product) },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }
