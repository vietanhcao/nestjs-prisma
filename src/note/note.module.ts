import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  controllers: [NoteController],
  imports: [],
  providers: [NoteService],
})
export class NoteModule {}
