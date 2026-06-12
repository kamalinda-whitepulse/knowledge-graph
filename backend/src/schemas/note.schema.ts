import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })  // adds createdAt and updatedAt automatically
export class Note extends Document {

  @Prop({ required: true })
  title: string;         // note title — required

  @Prop({ default: '' })
  content: string;       // note body — optional, defaults to empty

  @Prop({ type: [String], default: [] })
  tags: string[];        // array of tags like ['backend', 'nestjs']

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // which user owns this note

}

export const NoteSchema = SchemaFactory.createForClass(Note);