import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Note, NoteSchema } from '../schemas/note.schema';
import { Relationship, RelationshipSchema } from '../schemas/relationship.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name,         schema: NoteSchema         },
      { name: Relationship.name, schema: RelationshipSchema },
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
