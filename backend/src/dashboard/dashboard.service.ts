import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note } from '../schemas/note.schema';
import { Relationship } from '../schemas/relationship.schema';

@Injectable()
export class DashboardService {

  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(Relationship.name) private relationshipModel: Model<Relationship>,
  ) {}

  async getDashboard(userId: string) {

    const [totalNotes, totalConnections, mostConnected, recentNotes] = await Promise.all([

      // --- TOTAL NOTES --------------------------------
      this.noteModel.countDocuments({ userId }),

      // --- TOTAL CONNECTIONS ----------------------------
      this.relationshipModel.countDocuments({ userId }),

      // --- MOST CONNECTED NOTES (incoming + outgoing) ---
      this.relationshipModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        {
          $facet: {
            outgoing: [{ $group: { _id: '$fromNoteId', count: { $sum: 1 } } }],
            incoming: [{ $group: { _id: '$toNoteId',   count: { $sum: 1 } } }],
          }
        },
        { $project: { combined: { $concatArrays: ['$outgoing', '$incoming'] } } },
        { $unwind: '$combined' },
        { $group: { _id: '$combined._id', count: { $sum: '$combined.count' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from:         'notes',
            localField:   '_id',
            foreignField: '_id',
            as:           'note',
          }
        },
        { $unwind: { path: '$note', preserveNullAndEmptyArrays: false } },
        {
          $project: {
            _id:   0,
            count: 1,
            title: '$note.title',
            tags:  '$note.tags',
          }
        },
      ]),

      // --- RECENTLY CREATED NOTES ---------------------
      this.noteModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title tags createdAt'),

    ]);

    return {
      totalNotes,
      totalConnections,
      mostConnected,
      recentNotes,
    };
  }

}
