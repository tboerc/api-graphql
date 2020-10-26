import {Field, ID, ObjectType} from 'type-graphql';
import {PrimaryGeneratedColumn, Column, Entity, BaseEntity} from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column({length: 75, unique: true})
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({length: 75})
  name: string;

  @Field()
  @Column()
  profile: string;

  @Field()
  token: string;
}
