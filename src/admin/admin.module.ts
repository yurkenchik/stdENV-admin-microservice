import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";

@Module({
    providers: [],
    controllers: [],
    imports: [
        TypeOrmModule.forFeature([User]),
        NatsClientModule
    ],
    exports: []
})
export class AdminModule {}