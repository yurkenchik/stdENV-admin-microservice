import {Controller} from "@nestjs/common";
import {AdminService} from "./admin.service";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {MessagePattern, Payload} from "@nestjs/microservices";

@Controller()
export class AdminMicroserviceController {

    constructor(
        private readonly adminService: AdminService,
    ) {}

    @MessagePattern({ cmd: "getTeachersRequestsWithCertificates" })
    async getTeachersRequestsWithCertificates(
        @Payload() userId: string
    ): Promise<Array<Partial<User>>>
    {
        return await this.adminService.getTeachersRequestsWithCertificates();
    }
    //
    // @MessagePattern({ cmd: "approveTeacher" })
    // async approveTeacher(
    //     @Payload() userId: string
    // ): Promise<Partial<User>>
    // {
    //     return await this.adminService.approveTeacher(userId);
    // }

}