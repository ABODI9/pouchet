import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() title: string;

  @Column({ type: 'text', nullable: true }) description?: string;

  @Column({
    type: 'numeric',
    transformer: {
      to: (v: number) => v,
      from: (v: string | null) => (v === null ? null : Number(v)),
    },
  })
  price: number;

  @Column({ nullable: true }) imageUrl?: string;

  @Column({ type: 'int', default: 0 }) rating: number;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
