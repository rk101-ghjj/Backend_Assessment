import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: createDto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(createDto.password, 10);
    const user = this.userRepository.create({
      email: createDto.email,
      passwordHash,
      role: createDto.role ?? 'user',
    });
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    if (updateDto.password) {
      user.passwordHash = await bcrypt.hash(updateDto.password, 10);
    }
    if (updateDto.role) user.role = updateDto.role;
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const res = await this.userRepository.delete({ id });
    if (!res.affected) throw new NotFoundException('User not found');
  }
}


