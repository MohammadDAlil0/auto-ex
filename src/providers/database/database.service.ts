import { Injectable } from "@nestjs/common";
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class DataBaseService {
    constructor() {}

    async findOneOrThrow<T>(model: any, options: any): Promise<T> {
        const record = await model.findOne(options);

        console.log(model.constructor.name);
        
        if (!record) {
            throw new NotFoundException('Record not found');
        }

        return record;
    }

    async findByPkOrThrow<T>(model: any, id: string): Promise<T> {
        const record = await model.findByPk(id);

        console.log(model.constructor.name)
        
        if (!record) {
            throw new NotFoundException('Invalid ID');
        }

        return record;
    }

}