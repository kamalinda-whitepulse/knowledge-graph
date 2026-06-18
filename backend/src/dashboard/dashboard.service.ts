import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../schemas/note.schema';
import { Relationship } from '../schemas/relationship.schema';

@Injectable()
export class DashboardService {

  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(Relationship.name) private relationshipModel: Model<Relationship>,
  ) {}

  async getDashboard(userId: string) {

    // --- TOTAL NOTES --------------------------------
    const totalNotes = await this.noteModel
      .countDocuments({ userId });

    // --- TOTAL CONNECTIONS ----------------------------
    const totalConnections = await this.relationshipModel
      .countDocuments({ userId });

    // --- MOST CONNECTED NOTES -------------------------
    const mostConnected = await this.relationshipModel.aggregate([
      {
        $match: {
          userId: new (require('mongoose').Types.ObjectId)(userId)
        }
      },
      {
        // group by fromNoteId and count links
        $group: {
          _id:   '$fromNoteId',
          count: { $sum: 1 },
        }
      },
      { $sort: { count: -1 } },  // highest first
      { $limit: 5 },             // top 5 only
      {
        // get note details
        $lookup: {
          from:         'notes',
          localField:   '_id',
          foreignField: '_id',
          as:           'note',
        }
      },
      { $unwind: '$note' },
      {
        $project: {
          _id:   0,
          count: 1,
          title: '$note.title',
          tags:  '$note.tags',
        }
      },
    ]);

    // --- RECENTLY CREATED NOTES -------------------------
    const recentNotes = await this.noteModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title tags createdAt');

    return {
      totalNotes,
      totalConnections,
      mostConnected,
      recentNotes,
    };
  }

}
