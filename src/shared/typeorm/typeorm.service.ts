import { Injectable, Inject } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    //console.log("env",process.env);
    return {
      type: 'postgres',
      host: process.env['DATABASE_HOST'],
      port: parseInt(process.env['DATABASE_PORT']),
      database: process.env['DATABASE_NAME'],
      username: process.env['DATABASE_USER'],
      password: process.env['DATABASE_PASSWORD'],
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: process.env['MODE']=="DEV", // never use TRUE in production!
    };
  }
}
