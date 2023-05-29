import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InsertNoteDto, UpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}

  async getNotes(userId: number) {
    return this.prismaService.note.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getNoteById(noteId: number) {
    return this.prismaService.note.findFirst({
      where: {
        id: noteId,
      },
    });
  }

  async insertNote(userId: number, dto: InsertNoteDto) {
    const note = await this.prismaService.note.create({
      data: {
        ...dto,
        userId: userId,
      },
    });

    return note;
  }

  async updateNoteById(noteId: number, dto: UpdateNoteDto) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
      },
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return this.prismaService.note.update({
      where: {
        id: noteId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteNoteById(userId: number, noteId: number) {
    const note = await this.prismaService.note.findFirst({
      where: {
        id: noteId,
        userId: userId,
      },
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}
