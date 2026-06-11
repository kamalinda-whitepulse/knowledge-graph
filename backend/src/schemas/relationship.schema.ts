import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// These are the only allowed relationship types
export enum RelationshipType {
  RELATED_TO   = 'Related To',
  DEPENDS_ON   = 'Depends On',
  REFERENCES   = 'References',
  PARENT_OF    = 'Parent Of',
}

@Schema({ timestamps: true })
export class Relationship extends Document {

  @Prop({ type: Types.ObjectId, ref: 'Note', required: true })
  fromNoteId: Types.ObjectId;  // the note where the link starts

  @Prop({ type: Types.ObjectId, ref: 'Note', required: true })
  toNoteId: Types.ObjectId;    // the note where the link ends

  @Prop({ enum: RelationshipType, required: true })
  type: RelationshipType;      // what kind of link is it

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;      // who created this link

}

export const RelationshipSchema = SchemaFactory.createForClass(Relationship);