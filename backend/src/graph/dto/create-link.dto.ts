import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { RelationshipType } from '../../schemas/relationship.schema';

export class CreateLinkDto {

  @IsString()
  @IsNotEmpty()
  fromNoteId!: string;

  @IsString()
  @IsNotEmpty()
  toNoteId!: string;

  @IsEnum(RelationshipType, {
    message: 'type must be one of: Related To, Depends On, References, Parent Of'
  })
  type!: RelationshipType;

}
