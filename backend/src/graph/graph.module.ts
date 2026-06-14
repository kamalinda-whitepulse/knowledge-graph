import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphService } from './graph.service';
import { Relationship, RelationshipSchema } from '../schemas/relationship.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Relationship.name, schema: RelationshipSchema }])],
  providers: [GraphService]
})
export class GraphModule {}