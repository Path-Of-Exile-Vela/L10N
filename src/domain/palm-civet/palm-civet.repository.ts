import {PalmCivetSchemaLiteral} from "./palm-civet.schema";
import {PalmCivet} from './palm-civet'
import {AssetChecksum} from "@poe-vela/core/l10n";
import {identity} from "lodash-es";
import {PalmCivetFiles} from "./palm-civet-files";
import {RepositoryBase, RxRepositoryBase} from "@poe-vela/core/repository";
import {PreferenceEntityDefault, PreferenceService} from "@/domain/preference";

export class StaticLocalRepository extends RxRepositoryBase<PalmCivet> {
  get dbName() {
    return "palm-civet";
  }

  async initialize(): Promise<void> {
    await this.database.addCollections({
      [this.dbName]: {
        schema: PalmCivetSchemaLiteral,
        migrationStrategies: {
          1: identity,
          2: identity,
        },
      },
    });
    return Promise.resolve(undefined);
  }

  create(struct: PalmCivet): Promise<PalmCivet> {
    throw new Error("Method not implemented.");
  }

  createMany(structs: PalmCivet[]): Promise<PalmCivet[]> {
    throw new Error("Method not implemented.");
  }

  delete(struct: PalmCivet): Promise<any> {
    throw new Error("Method not implemented.");
  }

  deleteMany(structs: PalmCivet[]): Promise<any> {
    throw new Error("Method not implemented.");
  }

  query(args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  update(struct: PalmCivet): Promise<PalmCivet> {
    throw new Error("Method not implemented.");
  }

  updateMany(structs: PalmCivet[]): Promise<any> {
    throw new Error("Method not implemented.");
  }

}

export class StaticRemoteRepository extends RepositoryBase<PalmCivet> {

  get assetHost() {
    const preference = PreferenceService.Instance.preference;
    const assetServer = preference.assetServer || PreferenceEntityDefault.assetServer;
    const host = `${assetServer}/master/${PreferenceService.Instance.preference.language}/`
    if (preference.assetProxy) {
      return preference.assetProxy + host;
    } else {
      return host;
    }
  }

  all(): Promise<PalmCivet> {
    return Promise
      .all(
        PalmCivetFiles.files.map(async (file) => fetch(this.assetHost + file.fileName, {cache: "no-store"}))
      )
      .then((results) => {
        return Promise.all(results.map(res => res.text()))
      })
      .then(result => {
        return result.reduce((prev, curr, currentIndex) => {
            return {
              ...prev,
              [PalmCivetFiles.files[currentIndex].fileField]: curr,
            }
          },
          {
            lang: PreferenceService.Instance.preference.language
          } as PalmCivet
        )
      })
  }

  fetch(fileName: string) {
    return fetch(this.assetHost + fileName, {cache: "no-store"})
  }

  checksum(): Promise<AssetChecksum[]> {
    return fetch(this.assetHost + `checksums.min.json`, {cache: "no-store"})
      .then(res => res.json())
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }

  create(struct: PalmCivet): Promise<PalmCivet> {
    throw new Error("Method not implemented.");
  }

  createMany(structs: PalmCivet[]): Promise<PalmCivet[]> {
    throw new Error("Method not implemented.");
  }

  delete(struct: PalmCivet): Promise<any> {
    throw new Error("Method not implemented.");
  }

  deleteMany(structs: PalmCivet[]): Promise<any> {
    throw new Error("Method not implemented.");
  }

  query(args: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  update(struct: PalmCivet): Promise<PalmCivet> {
    throw new Error("Method not implemented.");
  }

  updateMany(structs: PalmCivet[]): Promise<any> {
    throw new Error("Method not implemented.");
  }

  upsert(struct: PalmCivet): Promise<any> {
    throw new Error("Method not implemented.");
  }

  upsertMany(structs: PalmCivet[]): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
