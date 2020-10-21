import {Field, InputType} from 'type-graphql';
import {GraphQLUpload, FileUpload} from 'graphql-upload';
import {IsEmail, MaxLength, MinLength} from 'class-validator';

import {User} from '../../entities/user';

@InputType()
export class AddUserInput implements Omit<Partial<User>, 'profile'> {
  @Field()
  @IsEmail()
  @MaxLength(75)
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  @Field()
  @MaxLength(75)
  name: string;

  @Field((type) => GraphQLUpload)
  profile: Promise<FileUpload>;
}
