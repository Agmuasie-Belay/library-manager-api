import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import { Book } from '../entities/book.entity';
import { Member } from '../entities/member.entity';
import { Staff } from '../entities/staff.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async seed() {
    // Seed genres
    const genres = [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Mystery',
      'Romance',
      'Biography',
      'History',
      'Science',
      'Technology',
      'Philosophy',
    ];

    const createdGenres = [];
    for (const genreName of genres) {
      const existingGenre = await this.genreRepository.findOne({
        where: { name: genreName },
      });

      if (!existingGenre) {
        const genre = this.genreRepository.create({ name: genreName });
        createdGenres.push(await this.genreRepository.save(genre));
      } else {
        createdGenres.push(existingGenre);
      }
    }

    // Seed sample books
    const sampleBooks = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        published_year: 1925,
        available_copies: 3,
        genre_id: createdGenres[0].id, // Fiction
      },
      {
        title: '1984',
        author: 'George Orwell',
        published_year: 1949,
        available_copies: 2,
        genre_id: createdGenres[2].id, // Science Fiction
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        published_year: 1813,
        available_copies: 4,
        genre_id: createdGenres[4].id, // Romance
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        published_year: 1937,
        available_copies: 2,
        genre_id: createdGenres[0].id, // Fiction
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        published_year: 1988,
        available_copies: 1,
        genre_id: createdGenres[7].id, // Science
      },
    ];

    for (const bookData of sampleBooks) {
      const existingBook = await this.bookRepository.findOne({
        where: { title: bookData.title, author: bookData.author },
      });

      if (!existingBook) {
        const book = this.bookRepository.create(bookData);
        await this.bookRepository.save(book);
      }
    }

    // Seed sample members
    const sampleMembers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-0101',
        join_date: new Date('2023-01-15'),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '555-0102',
        join_date: new Date('2023-02-20'),
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '555-0103',
        join_date: new Date('2023-03-10'),
      },
    ];

    for (const memberData of sampleMembers) {
      const existingMember = await this.memberRepository.findOne({
        where: { email: memberData.email },
      });

      if (!existingMember) {
        const member = this.memberRepository.create(memberData);
        await this.memberRepository.save(member);
      }
    }

    // Seed default admin user
    const adminUser = await this.staffRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = this.staffRepository.create({
        username: 'admin',
        email: 'admin@library.com',
        password_hash: hashedPassword,
        role: 'admin',
      });
      await this.staffRepository.save(admin);
      console.log('Default admin user created: admin@library.com/admin123');
    }

    // Seed default librarian user
    const librarianUser = await this.staffRepository.findOne({
      where: { username: 'librarian' },
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('librarian123', 10);
      const admin = this.staffRepository.create({
        username: 'librarian',
        email: 'librarian@library.com',
        password_hash: hashedPassword,
        role: 'librarian',
      });
      await this.staffRepository.save(admin);
      console.log('Default admin user created: admin@library.com/admin123');
    }

    console.log('Database seeded successfully!');
  }
} 
