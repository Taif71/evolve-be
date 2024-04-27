import {
  ApiProperty,
  OmitType
} from '@nestjs/swagger';
import { UserProfileDto } from './user-profile.dto';
import { IUserProfile } from 'src/users/interfaces';

export class UpdateUserProfileDto extends OmitType(UserProfileDto, [
  'user',
  'wallet',
  'cTime',
  'cBy',
  'uTime',
  'uBy'
] as const)
  implements Readonly<UpdateUserProfileDto> {
  constructor(data?: Omit<IUserProfile, 'user' | 'wallet' | 'cBy' | 'cTime' | 'uBy' | 'uTime'>) {
    super(data);
  }
}
