import { dataSourceOptions } from '@studENV/shared/dist/typeorm/typeorm.config';
import { NatsClientModule } from '@studENV/shared/dist/nats-client/nats-client.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
      NatsClientModule,
      TypeOrmModule.forRoot(dataSourceOptions as DataSourceOptions)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
