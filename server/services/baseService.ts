export abstract class BaseService {
    abstract create(tk);
    abstract getbyId(id);
    abstract update(doc);
    abstract delete(id);
    abstract getAll();
}