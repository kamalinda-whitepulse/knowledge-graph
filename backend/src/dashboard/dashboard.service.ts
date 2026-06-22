import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note } from '../schemas/note.schema';
import { Relationship } from '../schemas/relationship.schema';
import { DashboardResult, RecentNote } from './interfaces/dashboard-result.interface';

@Injectable()
export class DashboardService {

  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(Relationship.name) private relationshipModel: Model<Relationship>,
  ) {}

  async getDashboard(userId: string): Promise<DashboardResult> {

    // validate userId before constructing ObjectId
    if (
      !Types.ObjectId.isValid(userId) ||
      new Types.ObjectId(userId).toHexString() !== userId
    ) {
      throw new BadRequestException('Invalid user id');
  }
    const userObjectId = new Types.ObjectId(userId);

    const [totalNotes, totalConnections, mostConnected, recentNotes] = await Promise.all([

      // --- TOTAL NOTES -------------------------------------
      this.noteModel.countDocuments({ userId: userObjectId }),

      // --- TOTAL CONNECTIONS -------------------------------
      this.relationshipModel.countDocuments({ userId: userObjectId }),

      // --- MOST CONNECTED NOTES (incoming + outgoing) ---
      this.relationshipModel.aggregate([
        { $match: { userId: userObjectId } },
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
            from:         this.noteModel.collection.name, // derive at runtime, not hardcoded
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

      // --- RECENTLY CREATED NOTES ----------------------
      this.noteModel
        .find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        // exclude _id to match mostConnected shape
        .select('-_id title tags createdAt')
        .lean<RecentNote[]>(),

    ]);

    return {
      totalNotes,
      totalConnections,
      mostConnected,
      recentNotes,
    };
  }

}
