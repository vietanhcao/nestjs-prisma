import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { MyJwtGuard } from '../auth/guard';
import { InsertNoteDto, UpdateNoteDto } from './dto/note.dto';
import { NoteService } from './note.service';

@UseGuards(MyJwtGuard)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get()
  getNotes(@GetUser('id') userId: number) {
    return this.noteService.getNotes(userId);
  }

  @Get(':id')
  getNoteById(@GetUser('id') userId: number) {
    return this.noteService.getNoteById(userId);
  }

  @Post()
  insertNote(@GetUser('id') userId: number, @Body() body: InsertNoteDto) {
    return this.noteService.insertNote(userId, body);
  }

  @Patch(':id')
  updateNote(
    @Param('id', ParseIntPipe) noteId: number,
    @Body() body: UpdateNoteDto,
  ) {
    return this.noteService.updateNoteById(noteId, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/delete')
  deleteNote(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) noteId: number,
  ) {
    return this.noteService.deleteNoteById(userId, noteId);
  }
}
