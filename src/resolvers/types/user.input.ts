import {IsEmail, MaxLength, MinLength} from 'class-validator';
import {Field, InputType} from 'type-graphql';
import {User} from '../../entities/user';

@InputType()
export class AddUserInput implements Partial<User> {
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
}
