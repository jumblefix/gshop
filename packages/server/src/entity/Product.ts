import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn
} from 'typeorm';
import { makeSlug } from './../utils/utils';
import { Category } from './Category';

@Entity('products')
@Unique(['slug'])
@Index(['isBanned'])
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('varchar', { length: 255 })
  slug: string;

  @Column('varchar', { length: 255, nullable: true })
  coverImage: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('double', { default: 0 })
  rating: number;

  @Column('double', { default: 0 })
  offerPrice: number;

  @Column('double', { default: 0 })
  price: number;

  @Column('double', { default: 0 })
  yourSavings: number;

  @Column({ default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @BeforeInsert()
  async slugify() {
    this.slug = makeSlug(this.title);
    this.yourSavings = this.offerPrice - this.price;
  }
}
