import bcrypt from 'bcryptjs';
import {ApolloError} from 'apollo-server-express';
import {Resolver, Query, Arg, Mutation, Authorized} from 'type-graphql';

import {User} from '../entities/user';
import {Auth, getMessage, upload} from '../helpers';
import {AddUserInput, LoginUserInput} from './types/user.input';

const SALT_ROUNDS = 10;

@Resolver(User)
export class UserResolver {
  @Query((returns) => User)
  user(@Arg('userId') userId: number) {
    return User.findOne(userId);
  }

  @Authorized()
  @Query((returns) => [User])
  users() {
    return User.find();
  }

  @Mutation((returns) => User)
  async addUser(@Arg('data') data: AddUserInput) {
    const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const url = await upload.single(data.profile, 'images/profile');

    const user = new User();

    user.email = data.email;
    user.password = hash;
    user.name = data.name;
    user.profile = url ?? '';

    await user.save();

    return {...user, token: Auth.generate({id: user.id})};
  }

  @Mutation((returns) => User)
  async loginUser(@Arg('data') data: LoginUserInput) {
    const user = await User.findOne({where: {email: data.email}});
    if (!user) throw new ApolloError(getMessage('user.loginUser.noEmailMatch'));

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new ApolloError(getMessage('user.loginUser.noPasswordMatch'));

    return {...user, token: Auth.generate({id: user.id})};
  }
}
