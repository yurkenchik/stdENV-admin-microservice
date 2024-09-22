import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

    console.log("Admin microservice is running...")
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.NATS,
        options: {
            servers: ['nats://localhost:4222'],
        }
    });
    
    await app.listen()
        .then(() => console.log("Admin microservice has successfully started!"))
        .catch(error => {
            console.error("Error starting admin microservice: ", error);
            setTimeout(bootstrap, 10000);
        });
  
}
bootstrap();
