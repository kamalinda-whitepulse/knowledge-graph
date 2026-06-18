import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum RelationshipType {
  RELATED_TO = 'Related To',
  DEPENDS_ON = 'Depends On',
  REFERENCES = 'References',
  PARENT_OF  = 'Parent Of',
}

@Schema({ timestamps: true })
export class Relationship extends Document {

  @Prop({ type: Types.ObjectId, ref: 'Note', required: true })
  fromNoteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Note', required: true })
  toNoteId: Types.ObjectId;

  @Prop({ enum: RelationshipType, required: true })
  type: RelationshipType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

}

export const RelationshipSchema = SchemaFactory.createForClass(Relationship);

//prevents duplicate links at database level
RelationshipSchema.index(
  { fromNoteId: 1, toNoteId: 1, type: 1, userId: 1 },
  { unique: true }
);
