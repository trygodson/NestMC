import { PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}

// For Mongoose
// @Schema()
// export class AbstractDocument {
//   @Prop({ type: SchemaTypes.ObjectId })
//   _id: string;
// }
