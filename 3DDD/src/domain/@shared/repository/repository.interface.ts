export default interface RepositoryInterface<T> 
{

    //if i'm creating or updating the object, I already have it, so, does not need to return
    create(entity: T): Promise<void>;
    update(entity: T): Promise<void>;

    find(id: string): Promise<T>;
    findAll(): Promise<T[]>;

}