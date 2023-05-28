import {RepositoryBase} from "./repository";
import {RxDatabase} from "rxdb";
import {DB} from "../driver";

export abstract class RxRepositoryBase<T> extends RepositoryBase<T> {
  abstract get dbName(): string;
  get database(): RxDatabase {
    return DB.Instance.driver;
  }

  findOne(): Promise<T> {
    return this.database[this.dbName].findOne().exec().then(res => res?.toJSON())
  }


  insert(struct: T): Promise<void> {
    return this.database[this.dbName].insert(struct)
  }

  async upsert(struct: Partial<T>): Promise<null> {
    return this.database[this.dbName].upsert(struct)
  }

  async upsertMany(structs: T[]) {
    return this.database[this.dbName].bulkInsert(structs)
  }

  deleteAll(): Promise<any> {
    return this.database[this.dbName].remove()
  }

}