import { DynamicModule, Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
interface RmqModuleOptions {
  name: string;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(...rmqModuleOptions: RmqModuleOptions[]): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync(this.registerClients(rmqModuleOptions)),
      ],
      exports: [ClientsModule],
    };
  }
  private static registerClients(rmqModuleOptions: RmqModuleOptions[]) {
    const modules = rmqModuleOptions.map((option) => {
      return {
        name: option.name,
        useFactory: (
          configService: ConfigService,
        ): ClientProvider | Promise<ClientProvider> => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RABBIT_MQ_URI')],
              queue: configService.get<string>(
                `RABBIT_MQ_${option.name}_QUEUE`,
              ),
            },
          };
        },
        inject: [ConfigService],
      };
    });
    return modules;
  }
}
