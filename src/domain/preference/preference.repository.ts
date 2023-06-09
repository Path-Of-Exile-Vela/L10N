import {PreferenceSchemaLiteral} from "./preference.schema";
import {PreferenceEntity} from "./preference.entity";
import {RxRepositoryBase} from "@poe-vela/core/repository";
import {identity} from "@poe-vela/core";

export class PreferenceRepository extends RxRepositoryBase<PreferenceEntity> {
  get dbName(): string {
    return "preference";
  }

  async initialize(): Promise<any> {
    await this.database.addCollections({
      [this.dbName]: {
        schema: PreferenceSchemaLiteral,
        migrationStrategies: {
          1: identity,
        }
      },
    });
    return Promise.resolve()
  }

  /**
   * 读取第一条数据
   */
  get(): Promise<PreferenceEntity | null> {
    return this.findOne();
  }

  /**
   * 更新或覆盖
   */
  upsert(struct: PreferenceEntity): Promise<null> {
    struct.id = "1";
    return this.database[this.dbName].upsert(struct)
  }

  /**
   * 创建
   */
  async create(struct: PreferenceEntity): Promise<PreferenceEntity> {
    struct.id = "1";
    await this.database[this.dbName].insert(struct)
    return Promise.resolve(struct);
  }

  /**
   * 删除
   */
  async delete(): Promise<null> {
    const result = this.database[this.dbName].find({
      selector: {
        id: "1"
      }
    });
    await result.remove();
    return Promise.resolve(null);
  }

  createMany(structs: PreferenceEntity[]): Promise<PreferenceEntity[]> {
    throw new Error("Method not implemented.");
  }

  deleteMany(structs: PreferenceEntity[]): Promise<any> {
    throw new Error("Method not implemented.");
  }

  query(args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  update(struct: PreferenceEntity): Promise<PreferenceEntity> {
    throw new Error("Method not implemented.");
  }

  updateMany(structs: PreferenceEntity[]): Promise<any> {
    throw new Error("Method not implemented.");
  }

}
