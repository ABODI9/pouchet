import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';

@Entity({ name: 'featured' })
export class Featured {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  imageUrl!: string; // مثال: /uploads/123.png

  @Index()
  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'varchar', nullable: true })
  productId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  caption!: string | null;

  @Column({ type: 'boolean', nullable: true })
  openInNewTab!: boolean | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
