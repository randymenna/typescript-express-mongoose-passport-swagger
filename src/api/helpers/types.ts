export interface IMongoWriteResult {
    ok?: number;
    n?: number;
    deletedCount?: number;
    nMatched?: number;
    nUpserted?: number;
    nModified?: number;
}
