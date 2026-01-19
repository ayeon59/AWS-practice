import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  originalName!: string;

  @Column({ length: 255 })
  fileName!: string;

  @Column({ length: 500 })
  s3Key!: string;

  @Column({ length: 1000 })
  s3Url!: string;

  @Column({ length: 100 })
  mimeType!: string;

  @Column('bigint')
  size!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
