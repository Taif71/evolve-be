
export interface ILocation {
  readonly _id: string;
  readonly address: string;
  readonly city: String;
  readonly state: String;
  readonly country: String;
  readonly zipCode: string;
  readonly lat: number;
  readonly lng: number;
  readonly isCurrent: boolean;
  readonly isPermanent: boolean;
  readonly isDeleted: boolean;
}
