import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Relationship, RelationshipType } from '../schemas/relationship.schema';
import { Note } from '../schemas/note.schema';

@Injectable()
export class GraphService {

  constructor(
    @InjectModel(Relationship.name) private relationshipModel: Model<Relationship>,
    @InjectModel(Note.name) private noteModel: Model<Note>,
  ) {}

  // --- CREATE LINK ------------------------
  async createLink(userId: string, body: {
    fromNoteId: string;
    toNoteId: string;
    type: RelationshipType;
  }) {
    // self-link check
    if (body.fromNoteId === body.toNoteId) {
      throw new BadRequestException('A note cannot be linked to itself');
    }

    // check both notes exist and belong to this user
    const fromNote = await this.noteModel.findOne({ _id: body.fromNoteId, userId });
    if (!fromNote) throw new NotFoundException('Source note not found');

    const toNote = await this.noteModel.findOne({ _id: body.toNoteId, userId });
    if (!toNote) throw new NotFoundException('Target note not found');

    // application level check for friendly error message
    const existing = await this.relationshipModel.findOne({
      fromNoteId: body.fromNoteId,
      toNoteId:   body.toNoteId,
      type:       body.type,
      userId,
    });
    if (existing) throw new BadRequestException('This link already exists');

    try {
      return await this.relationshipModel.create({
        fromNoteId: body.fromNoteId,
        toNoteId:   body.toNoteId,
        type:       body.type,
        userId,
      });
    } catch (err: any) {
      // catch duplicate key error from MongoDB unique index
      if (err.code === 11000) {
        throw new BadRequestException('This link already exists');
      }
      throw err;
    }
  }

  // --- GET CONNECTIONS FOR A NOTE ------------------------
  async getConnections(noteId: string, userId: string) {
    // outgoing links — links that start from this note
    const outgoing = await this.relationshipModel
      .find({ fromNoteId: noteId, userId })
      .populate({ path: 'toNoteId', select: 'title tags' });

    // incoming links - links that point to this note
    const incoming = await this.relationshipModel
      .find({ toNoteId: noteId, userId })
      .populate({ path: 'fromNoteId', select: 'title tags' });

    return {
      incoming: incoming.map(rel => ({
        linkId: rel._id,
        type:   rel.type,
        note:   rel.fromNoteId,
      })),
      outgoing: outgoing.map(rel => ({
        linkId: rel._id,
        type:   rel.type,
        note:   rel.toNoteId,
      })),
    };
  }

  // --- GET FULL GRAPH ------------------------
  async getFullGraph(userId: string) {
    // get all notes for this user
    const notes = await this.noteModel
      .find({ userId })
      .select('title tags');

    // get all relationships for this user
    const relationships = await this.relationshipModel
      .find({ userId });

    // format for React Flow
    const nodes = notes.map(note => ({
      id:   note._id.toString(),
      data: { label: note.title, tags: note.tags },
    }));

    const edges = relationships.map(rel => ({
      id:     rel._id.toString(),
      source: rel.fromNoteId.toString(),
      target: rel.toNoteId.toString(),
      label:  rel.type,
    }));

    return { nodes, edges };
  }

  // --- DELETE LINK ------------------------
  async deleteLink(linkId: string, userId: string) {
    const link = await this.relationshipModel.findOneAndDelete({
      _id: linkId,
      userId,
    });
    if (!link) throw new NotFoundException('Link not found');
    return { message: 'Link deleted successfully' };
  }

}
