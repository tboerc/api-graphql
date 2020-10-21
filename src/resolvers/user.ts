import bcrypt from 'bcrypt';
import {Repository} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {Resolver, Query, Arg, Mutation} from 'type-graphql';

import {upload} from '../helpers';
import {User} from '../entities/user';
import {AddUserInput} from './types/user.input';

const SALT_ROUNDS = 10;

@Resolver(User)
export class UserResolver {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Query((returns) => User)
  user(@Arg('userId') userId: number) {
    return this.userRepository.findOne(userId);
  }

  @Query((returns) => [User])
  users() {
    return this.userRepository.find();
  }

  @Mutation((returns) => User)
  async addUser(@Arg('data') data: AddUserInput) {
    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const url = await upload.single(data.profile, 'images/profile');

    const user = this.userRepository.create({
      profile: url,
      name: data.name,
      email: data.email,
      password: hash,
    });

    return this.userRepository.save(user);
  }
}
