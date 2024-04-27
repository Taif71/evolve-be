import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { SCHEMA } from 'src/common/mock';

export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({
    minlength: 2,
    maxlength: 300,
  })
  address: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.CITY,
  })
  city: String;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.STATE,
  })
  state: String;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: SCHEMA.COUNTRY,
  })
  country: String;

  @Prop()
  zipCode: string;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
