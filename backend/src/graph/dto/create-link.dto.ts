import { IsMongoId, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RelationshipType } from '../../schemas/relationship.schema';

export class CreateLinkDto {

  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Source note ID' })
  @IsMongoId()
  fromNoteId!: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Target note ID' })
  @IsMongoId()
  toNoteId!: string;

  @ApiProperty({ enum: RelationshipType, example: RelationshipType.DEPENDS_ON })
  @IsEnum(RelationshipType, {
    message: 'type must be one of: Related To, Depends On, References, Parent Of'
  })
  type!: RelationshipType;

}
