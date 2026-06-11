import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// This tells NestJS this class is a MongoDB schema
@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ required: true, unique: true })
  email: string;         // must be unique, no two users same email

  @Prop({ required: true })
  passwordHash: string;  // never store plain password, always hashed

}

// This line converts the class into an actual Mongoose schema
export const UserSchema = SchemaFactory.createForClass(User);