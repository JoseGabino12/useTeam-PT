import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { IUserRepository } from '../domain/user.repository';
import { User } from '../domain/user.entity';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  private collection: Collection<User>;

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
    this.collection = this.db.collection('users');
  }

  async create(user: User): Promise<User> {
    await this.collection.insertOne(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.collection.findOne({ email });
    return data ? (data as unknown as User) : null;
  }

  async findAll(): Promise<User[]> {
    return (await this.collection.find().toArray()) as User[];
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.collection.findOne({ id });
    return data ? (data as unknown as User) : null;
  }
}
