import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        uri: process.env.MONGODB_URI,
        retryAttempts: 10, // Số lần thử lại
        retryDelay: 1000, // Delay giữa các lần thử (ms)
        // Thêm debug
        connectionFactory: (connection) => {
          connection.on('error', (err) => console.log('MongoDB error:', err));
          connection.on('connected', () => console.log('MongoDB connected'));
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    ProductModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard, // Sử dụng guard cho tất cả các route
    // },
  ],
})
export class AppModule {}
