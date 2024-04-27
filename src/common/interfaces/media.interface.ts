export interface IMedia {
  readonly _id: string;
  uri: string;
  readonly mimetype: string;
  readonly type: string;
  readonly isDeleted: boolean;
}
