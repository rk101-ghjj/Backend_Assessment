import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(ownerId: string, dto: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create({ ...dto, owner: { id: ownerId } as any });
    return this.itemRepository.save(item);
  }

  async findAllForUser(ownerId: string): Promise<Item[]> {
    return this.itemRepository.find({ where: { owner: { id: ownerId } } });
  }

  async findOneForUser(ownerId: string, id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!item) throw new NotFoundException('Item not found');
    if (item.owner.id !== ownerId) throw new ForbiddenException('Not owner');
    return item;
  }

  async update(ownerId: string, id: string, dto: UpdateItemDto): Promise<Item> {
    const item = await this.findOneForUser(ownerId, id);
    Object.assign(item, dto);
    return this.itemRepository.save(item);
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const item = await this.findOneForUser(ownerId, id);
    await this.itemRepository.remove(item);
  }
}


