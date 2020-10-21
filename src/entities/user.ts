import {Field, ID, ObjectType} from 'type-graphql';
import {PrimaryGeneratedColumn, Column, Entity} from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column({length: 75})
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({length: 75})
  name: string;

  @Field()
  @Column()
  profile: string;
}
