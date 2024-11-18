import {HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Repository, UpdateResult} from "typeorm";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";
import {AdminRepository} from "./admin-repository.abstract";
import {firstValueFrom} from "rxjs";
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class AdminService extends AdminRepository {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy
    ) {
        super();
    }

    private teacherDataFieldsToSelect: Array<string> = ["id", "firstname", "lastname", "email", "age", "teacherCertificate"];

    async getTeachersRequestsWithCertificates(): Promise<Array<Partial<User>>> {
        try {
            const teacherRequests = await this.userRepository
                .createQueryBuilder()
                .where("teacherCertificate != null")
                .select(this.teacherDataFieldsToSelect)
                .getMany();

            if (!teacherRequests) {
                throw new NotFoundException("Teacher requests not found");
            }

            return teacherRequests;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async approveTeacher(userId: string): Promise<void> {
        try {
            const teacherRole = await this.roleRepository
                .createQueryBuilder()
                .where("role = :role", { role: RoleEnum.TEACHER })
                .getOne();

            if (!teacherRole) {
                throw new NotFoundException("Role not found");
            }

            await this.userRepository
                .createQueryBuilder()
                .where("id = :userId", { userId })
                .update({ role: teacherRole })
                .execute();
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async banUser(userId: string, banReason: string): Promise<Partial<User>> {
        try {
            const user = await firstValueFrom(
                this.natsClient.send({ cmd: "getUserById" }, userId)
            );

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

    async cancelUserBan(userId: string): Promise<Partial<User>> {
        try {
            const user = await firstValueFrom(
                this.natsClient.send({ cmd: "getUserById" }, userId)
            );

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