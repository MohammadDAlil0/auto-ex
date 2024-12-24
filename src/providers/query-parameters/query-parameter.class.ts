import { Op } from 'sequelize';
import { QueryParamsDto } from './dto/query-parameters';
import { BadRequestException } from '@nestjs/common';

export class GlobalQueryFilter<T> {
    private modelAttributes: string[];
    private query: QueryParamsDto;
    private attributes: string[] | undefined;
    private offset: number | undefined;
    private limit: number | undefined;
    private where: any = {};
    private include: any[] | undefined;

    constructor(query: QueryParamsDto, modelAttributes: string[]) {
        this.modelAttributes = modelAttributes;
        this.query = query;
    }

    setFields() {
        if (this.query.fields) {
            this.attributes = this.query.fields.filter(field => this.modelAttributes.includes(field));
        }
        return this;
    }

    setSearch() {
        if (this.query.search) {
            this.where[Op.or] = this.modelAttributes
                .filter(attr => typeof attr === 'string')
                .map(attr => ({
                    [attr]: { [Op.like]: `%${this.query.search}%` }
                }));
        }
        return this;
    }
    
    setFilter() {
        try {
            if (this.query.filter) {
                this.query.filter = JSON.parse(this.query.filter);
                const pureQueryFilter = {};
                this.modelAttributes.forEach(attribute => {
                    if (this.query.filter[attribute]) pureQueryFilter[attribute] = this.query.filter[attribute]
                });
                Object.assign(this.where, pureQueryFilter)
            }
            return this;
        }
        catch(err) {
            throw new BadRequestException('The filter paramater must be of type JSON')
        }
    }

    setCreatedBy(userId: string) {
        this.where['createdBy'] = userId;
        return this;
    }

    setPagination() {
        if (this.query.limit) {
            this.limit = this.query.limit;
            this.offset = this.query.limit * (this.query.page - 1) || 0;
        }
        return this;
    }

    setInclude(associations: any[]) {
        if (this.query.populate) {
            this.include = associations;
        }
        return this;
    }

    applyUserFilter(user: any, creatorField = 'createdBy') {
        if (user.role === 'TEACHER') {
            this.include = this.include?.filter(include => include.as !== 'creator');
            this.where[creatorField] = user.id;
        }
        return this;
    }

    getOptions() {
        return {
            attributes: this.attributes,
            where: this.where,
            include: this.include,
            limit: this.limit,
            offset: this.offset
        };
    }
}
