import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class BaseEntity{
    @PrimaryGeneratedColumn()
    public id!: number;

    /*
   * Create and Update Date Columns
   */
    @CreateDateColumn({ type: 'timestamp' })
    public createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedAt!: Date;
}

export default BaseEntity;