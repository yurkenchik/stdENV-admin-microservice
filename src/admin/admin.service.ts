import {HttpException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Repository, UpdateResult} from "typeorm";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";

@Injectable()
export class AdminService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    teacherDataFieldsToSelect: Array<string> = ["id", "firstname", "lastname", "email", "age", "teacherCertificate"];

    async getTeachersRequestsWithCertificates(): Promise<Array<Partial<User>>>
    {
        try {
            const teacherRequests = await this.userRepository
                .createQueryBuilder()
                .where("teacherCertificate != null")
                .select(this.teacherDataFieldsToSelect)
                .getMany();

            return teacherRequests;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    // async approveTeacher(teacherId: string): Promise<Partial<User>>
    // {
    //     try {
    //         const teacher = await this.userRepository
    //             .createQueryBuilder()
    //             .where("id = :teacherId", { teacherId: teacherId })
    //             .getOne();
    //
    //         const role = await this.role
    //         teacher.role = RoleEnum.TEACHER;
    //         await this.userRepository.save(teacher);
    //         return teacher;
    //     } catch (error) {
    //         if (error instanceof HttpException) {
    //             throw error;
    //         }
    //         throw new InternalServerErrorException(error.message);
    //     }
    // }

    async banUser(userId: string, banReason: string): Promise<Partial<User>>
    {
        try {
            const user = await this.userRepository
                .createQueryBuilder()
                .where("id = :userId", { userId: userId })
                .getOne();

            const userUpdateResult: UpdateResult = await this.userRepository
                .createQueryBuilder()
                .update({
                    ...user,
                    isBanned: true,
                    banReason: banReason
                })
                .execute();

            const updatedUser = userUpdateResult.raw[0];
            return updatedUser;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async cancelUserBan(userId: string): Promise<Partial<User>>
    {
        try {
            const user = await this.userRepository
                .createQueryBuilder()
                .where("id = :userId", { userId: userId })
                .getOne();

            const updateUserResult = await this.userRepository
                .createQueryBuilder()
                .where("id = :userId", { userId: user })
                .update({
                    ...user,
                    isBanned: false,
                    banReason: null
                })
                .select(this.teacherDataFieldsToSelect)
                .execute();

            const updatedUser = updateUserResult.raw[0];
            return updatedUser;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

}