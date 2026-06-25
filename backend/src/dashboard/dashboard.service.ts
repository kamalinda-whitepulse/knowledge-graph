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

      // --- MOST CONNECTED NOTES (incoming + outgoing) ------
      this.relationshipModel.aggregate([
        { $match: { $or: [{ userId: userObjectId }, { userId: userId }] } },
        // Emit two docs per relationship: one for source, one for target
        { $project: { noteIds: ['$fromNoteId', '$toNoteId'] } },
        { $unwind: '$noteIds' },
        // fromNoteId/toNoteId are stored as strings - convert to ObjectId for $lookup
        {
          $addFields: {
            noteIdObj: { $toObjectId: '$noteIds' },
          }
        },
        { $group: { _id: '$noteIdObj', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from:         this.noteModel.collection.name,
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
