import {User} from "@studENV/shared/dist/entities/user.entity";

export abstract class AdminRepository {
    abstract getTeachersRequestsWithCertificates(): Promise<Array<Partial<User>>>;
    abstract approveTeacher(userId: string): Promise<void>;
    abstract banUser(userId: string, banReason: string): Promise<Partial<User>>;
    abstract cancelUserBan(userId: string): Promise<Partial<User>>;
}

