import {
    Injectable,
    HttpException,
    HttpStatus,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserProfile, IUserProfiles } from '../interfaces';
import {
    CreateUserProfileDto,
    UpdateUserProfileDto,
    UserProfileDto,
    SearchUserProfileDto,
} from '../dto';
import {
    createSearchQuery,
    subDocUpdateWithArray,
    subDocUpdateWithObj,
} from '../../common/utils/helper';
// import { FilesService } from '../../files/services';
import { MediaDto } from '../../common/dto';
import { SCHEMA } from 'src/common/mock';

@Injectable()
export class UserProfileService {
    /**
     * Constructor
     * @param {Model<IUserProfile>} model
     * @param {Model<IUser>} userModel
     * @param {service<FilesService>} filesService
     */
    constructor(
        @InjectModel(SCHEMA.USER_PROFILE)
        private readonly model: Model<IUserProfile>,
        // private readonly filesService: FilesService,
    ) { }

    /**
     * Create a user profile
     * @param {IUser} user
     * @param {CreateUserProfileDto} createUserProfileDTO
     * @returns {Promise<IUserProfile>}
     */
    create(
        data: CreateUserProfileDto,
        user: IUser,
    ): Promise<IUserProfile> {
        try {
            const userProfileDTO = new UserProfileDto({
                ...data,
                user: user._id,
                cBy: user._id
            });
            userProfileDTO.user = user._id;
            userProfileDTO.cBy = user._id;
            const setUserProfile = { ...userProfileDTO, ...data };
            const registerDoc = new this.model(setUserProfile);
            return registerDoc.save();
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }

   
    /**
     * find user profile
     * @param {string} id
     * @param {string} slug
     * @param {string} userId
     * @returns {Promise<IUserProfile>}
     */
    async findOne(
        id?: string,
        userId?: string,
    ): Promise<IUserProfile> {
        try {
            const searchQuery: any = {};
            if (!id && !userId) {
                return Promise.reject(
                    new BadRequestException('Either id or userId is required!'),
                );
            }
            if (id) searchQuery._id = id;
            if (userId) searchQuery.user = userId;
            return this.model
                .findOne(searchQuery)
                .populate({
                    path: 'user',
                    select: {
                        email: 1,
                        userPreference: 1,
                        isActive: 1,
                        isVerified: 1,
                        isSuperAdmin: 1,
                        isAdmin: 1,
                    },
                })
                .populate([
                    {
                        path: 'location.city',
                        select: {
                            _id: 1,
                            name: 1,
                        },
                    },
                    {
                        path: 'location.state',
                        select: {
                            _id: 1,
                            name: 1,
                        },
                    },
                    {
                        path: 'location.country',
                        select: {
                            _id: 1,
                            name: 1,
                        },
                    },
                ])
                .lean()
                .exec();
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }

    /**
     * Find All user profile
     * @returns {Promise<IUserProfiles>}
     */
    async findAll(query: SearchUserProfileDto): Promise<IUserProfiles> {
        try {
            let sortQuery: any = { $natural: -1 };
            const searchQuery = createSearchQuery(query);
            const limit: number = (query && query.limit) || 10;
            const skip: number = (query && query.skip) || 0;

            if (query.hasOwnProperty('sort') && query.sort) {
                sortQuery = JSON.parse(query.sort);
            }

            if (
                query.hasOwnProperty('distance') &&
                query.hasOwnProperty('lat') &&
                query.hasOwnProperty('lng')
            ) {
                sortQuery = '';
                searchQuery['location.coordinates'] = {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [query.lat, query.lng],
                        },
                        $maxDistance: query.distance,
                        $minDistance: 0,
                    },
                };
            }

            const cursor = this.model
                .find(searchQuery)
                .populate({
                    path: 'user',
                    select: {
                        email: 1,
                        isActive: 1,
                        isVerified: 1,
                        isSuperAdmin: 1,
                        isAdmin: 1,
                        cTime: 1
                    },
                })
                .populate([
                    {
                        path: 'location.city',
                        select: {
                            _id: 1,
                            name: 1,
                        },
                    },
                    {
                        path: 'location.state',
                        select: {
                            _id: 1,
                            name: 1,
                        },
                    },
                    {
                        path: 'location.country',
                        select: {
                            _id: 1,
                            name: 1,
                        },
                    },
                ])
                .limit(limit)
                .skip(skip)
                .sort(sortQuery);
                
            const result: IUserProfiles = {
                data: await cursor.exec(),
            };

            if (query.pagination) {
                result.pagination = {
                    total: await this.model.countDocuments(searchQuery),
                    limit,
                    skip,
                };
            }
            return result;
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }

    /**
     * Count All user profile
     * @returns {Promise<number>}
     */
    async count(query: SearchUserProfileDto): Promise<number> {
        try {
            const searchQuery = createSearchQuery(query);

            if (
                query.hasOwnProperty('distance') &&
                query.hasOwnProperty('lat') &&
                query.hasOwnProperty('lng')
            ) {
                searchQuery['location.coordinates'] = {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [query.lat, query.lng],
                        },
                        $maxDistance: query.distance,
                        $minDistance: 0,
                    },
                };
            }

            return this.model.countDocuments(searchQuery).exec();
        } catch (err) {
            throw new HttpException(
                err,
                err.status || HttpStatus.BAD_REQUEST,
                {
                    cause: new Error(err)
                }
            );
        }
    }
}
