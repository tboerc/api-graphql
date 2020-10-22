import bcrypt from 'bcrypt';
import {Repository} from 'typeorm';
import {ApolloError} from 'apollo-server-express';
import {InjectRepository} from 'typeorm-typedi-extensions';
import {Resolver, Query, Arg, Mutation, Authorized} from 'type-graphql';

import {User} from '../entities/user';
import {Auth, getMessage, upload} from '../helpers';
import {AddUserInput, LoginUserInput} from './types/user.input';

const SALT_ROUNDS = 10;

@Resolver(User)
export class UserResolver {
  @InjectRepository(User)
  private repository: Repository<User>;

  @Query((returns) => User)
  user(@Arg('userId') userId: number) {
    return this.repository.findOne(userId);
  }

  @Authorized()
  @Query((returns) => [User])
  users() {
    return this.repository.find();
  }

  @Mutation((returns) => User)
  async addUser(@Arg('data') data: AddUserInput) {
    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const url = await upload.single(data.profile, 'images/profile');

    const user = this.repository.create({
      profile: url,
      name: data.name,
      email: data.email,
      password: hash,
    });

    const saved = await this.repository.save(user);

    return {...user, token: Auth.generate({id: saved.id})};
  }

  @Mutation((returns) => User)
  async loginUser(@Arg('data') data: LoginUserInput) {
    const user = await this.repository.findOne({where: {email: data.email}});
    if (!user) throw new ApolloError(getMessage('user.loginUser.noEmailMatch'));

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new ApolloError(getMessage('user.loginUser.noPasswordMatch'));

    return {...user, token: Auth.generate({id: user.id})};
  }
}
