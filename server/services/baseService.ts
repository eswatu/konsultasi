export abstract class BaseService {
    abstract create(tk);
    abstract getbyId(id);
    abstract update(id, doc);
    abstract delete(id);
    abstract getAll();
}