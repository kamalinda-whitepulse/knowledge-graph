import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../schemas/note.schema';

@Injectable()
export class NotesService {

  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
  ) {}

  // --- GET ALL ------------------------------------
  async getAllNotes(userId: string) {
    return this.noteModel
      .find({ userId })
      .sort({ createdAt: -1 }); // newest first
  }

  // --- GET ONE ------------------------------------
  async getNoteById(id: string, userId: string) {
    const note = await this.noteModel.findOne({ _id: id, userId });
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
      userId,
    });
    return note;
  }

  // --- UPDATE ------------------------------------
  async updateNote(id: string, userId: string, body: {
    title?: string;
    content?: string;
    tags?: string[];
  }) {
    // explicitly allowlist only safe fields
    const { title, content, tags } = body;
    const note = await this.noteModel.findOneAndUpdate(
      { _id: id, userId },
      { 
        $set: {
        ...(title   !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(tags    !== undefined && { tags }), 
        }
      },  
      // return updated document
      { new: true },       
    );
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  // --- DELETE ------------------------------------
  async deleteNote(id: string, userId: string) {
    const note = await this.noteModel.findOneAndDelete({ _id: id, userId });
    if (!note) throw new NotFoundException('Note not found');
    return { message: 'Note deleted successfully' };
  }

  // --- SEARCH ------------------------------------
  async searchNotes(userId: string, query: string) {
    // escape special characters to prevent ReDoS attacks
    const escaped = query.replace(/[.*+?^()|[\]\\]/g, '\\$&');
    // case insensitive
    const regex = new RegExp(escaped, 'i');
    return this.noteModel.find({
      userId,
      $or: [
        { title:   regex },
        { content: regex },
        { tags:    regex },
      ],
    });
  }

}
