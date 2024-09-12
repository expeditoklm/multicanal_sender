import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { MessageContactService } from './message-contact.service';
import { CreateMessageContactDto } from './dto/createMessageContactDto';
import { UpdateMessageContactDto } from './dto/updateMessageContactDto';
@Controller('messageContacts')
export class MessageContactController {
  constructor(private readonly messageContactService: MessageContactService) {}

  @Post()
  async create(@Body() createMessageContactDto: CreateMessageContactDto) {
    return this.messageContactService.create(createMessageContactDto);
  }

  @Get()
  async findAll() {
    return this.messageContactService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.messageContactService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateMessageContactDto: UpdateMessageContactDto) {
    return this.messageContactService.update(+id, updateMessageContactDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.messageContactService.remove(+id);
  }

  // Endpoint pour obtenir les audiences associées à un contact
  @Get('contact/:contactId/audiences')
  async findAudiencesByContact(@Param('contactId') contactId: number) {
    return this.messageContactService.findAudiencesByContact(+contactId);
  }

  // Endpoint pour obtenir les contacts associés à une audience spécifique
  @Get('audience/:audienceId/contacts')
  async findContactsByAudience(@Param('audienceId') audienceId: number) {
    return this.messageContactService.findContactsByAudience(+audienceId);
  }
}
