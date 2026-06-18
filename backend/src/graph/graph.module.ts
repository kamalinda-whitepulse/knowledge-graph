import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphService } from './graph.service';
import { GraphController } from './graph.controller';
import { Relationship, RelationshipSchema } from '../schemas/relationship.schema';
import { Note, NoteSchema } from '../schemas/note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Relationship.name, schema: RelationshipSchema },
      { name: Note.name,         schema: NoteSchema         },
    ]),
  ],
  providers: [GraphService],
  controllers: [GraphController],
  exports: [GraphService],
})
export class GraphModule {}
