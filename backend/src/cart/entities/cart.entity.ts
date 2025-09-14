import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

export type CartStatus = 'open' | 'checked_out' | 'abandoned';

@Entity('cart_items')
@Index(['sessionId', 'status'])
@Index(['userId', 'status'])
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  userId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  sessionId!: string | null; // للزوّار غير المسجلين

  @Column({ type: 'varchar' })
  productId!: string;         // اربطه بجدول المنتجات عندك لو حبيت

  @Column({ type: 'varchar' })
  productName!: string;

  @Column({ type: 'varchar', nullable: true })
  productImage!: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  unitPrice!: string;         // string للحفاظ على الدقة (numeric)

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ type: 'varchar', default: 'open' })
  status!: CartStatus;

  @Column({ type: 'varchar', nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
