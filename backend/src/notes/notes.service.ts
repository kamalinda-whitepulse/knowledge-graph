import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';  
import { Note } from '../schemas/note.schema';

@Injectable()
export class NotesService {

  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
  ) {}

  // --- GET ALL ------------------------------------
  async getAllNotes(userId: string) {
    return this.noteModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
  }

  // --- GET ONE ------------------------------------
  async getNoteById(id: string, userId: string) {
    const note = await this.noteModel.findOne({ 
      _id: id, 
      userId: new Types.ObjectId(userId) 
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  // --- CREATE ------------------------------------
  async createNote(userId: string, body: {
    title: string;
    content?: string;
    tags?: string[];
  }) {
    const note = await this.noteModel.create({
      title:   body.title,
      content: body.content ?? '',
      tags:    body.tags    ?? [],
      userId:  new Types.ObjectId(userId), 
    });
    return note;
  }

  // --- UPDATE ------------------------------------
  async updateNote(id: string, userId: string, body: {
    title?: string;
    content?: string;
    tags?: string[];
  }) {
    const { title, content, tags } = body;
    const note = await this.noteModel.findOneAndUpdate(
      { _id: id, userId: new Types.ObjectId(userId) }, 
      {
        $set: {
          ...(title   !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(tags    !== undefined && { tags }),
        }
      },
      { new: true },
    );
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  // --- DELETE ------------------------------------
  async deleteNote(id: string, userId: string) {
    const note = await this.noteModel.findOneAndDelete({ 
      _id: id, 
      userId: new Types.ObjectId(userId)  
    });
    if (!note) throw new NotFoundException('Note not found');
    return { message: 'Note deleted successfully' };
  }

  // --- SEARCH ------------------------------------
  async searchNotes(userId: string, query: string) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    return this.noteModel.find({
      userId: new Types.ObjectId(userId), 
      $or: [
        { title:   regex },
        { content: regex },
        { tags:    regex },
      ],
    });
  }

}
