import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('featured')
export class Featured {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  imageUrl!: string; // مثال: /uploads/123.png

  // استخدم bigint لتفادي overflow مع Date.now()
  @Column({
    type: 'bigint',
    default: () => '0',
    transformer: {
      to: (v?: number | null) => (v ?? 0),
      from: (v: string) => Number(v),
    },
  })
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
