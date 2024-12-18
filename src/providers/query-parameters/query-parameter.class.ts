import { Op } from 'sequelize';
import { QueryParamsDto } from './dto/query-parameters';

export class GlobalQueryFilter<T> {
    private query: QueryParamsDto;
    private attributes: string[] | undefined;
    private offset: number | undefined;
    private limit: number | undefined;
    private where: any = {};
    private include: any[] | undefined;

    constructor(query: QueryParamsDto) {
        this.query = query;
    }

    setFields(modelAttributes: string[]) {
        if (this.query.fields) {
            this.attributes = this.query.fields.filter(field => modelAttributes.includes(field));
        }
        return this;
    }

    setSearch(modelAttributes: string[]) {
        if (this.query.search) {
            this.where[Op.or] = modelAttributes
                .filter(attr => typeof attr === 'string')
                .map(attr => ({
                    [attr]: { [Op.like]: `%${this.query.search}%` }
                }));
        }
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
