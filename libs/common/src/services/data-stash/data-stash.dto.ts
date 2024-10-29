export type DataStash = {
  pk: {
    fields: string[];
    separator: string;
  };
  uuid: {
    fields: string[];
    separator: string;
  };
  relations: RelationsObj[];
  column: string[];
  tableName: string;
};

type FColumn = {
  columnName: string;
  alias: string;
};
type RelationsObj = {
  fTable: string;
  fKey: string;
  key: string;
  fColumn: FColumn[];
};

export type DataStash_Payload = {
  pk: string;
  uuid: string;
  app: string;
  eml: string;
  data: {
    path: string;
    req: any;
    res: any;
  };
};
