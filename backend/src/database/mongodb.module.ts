import { Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        const uri = process.env.MONGO_URI;
        if (!uri) {
          throw new Error('MONGO_URI not defined in environment variables');
        }
        const client = new MongoClient(uri, {
          tls: true,
          tlsAllowInvalidCertificates: true,
          connectTimeoutMS: 20000,
          serverSelectionTimeoutMS: 20000,
        });
        await client.connect();
        const db = client.db(process.env.MONGO_DB_NAME || '');
        return db;
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class MongodbModule {}
