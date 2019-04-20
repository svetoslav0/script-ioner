import { IRepository } from "./interfaces/IRepository";

import { MysqlRepository } from "./MysqlRepository";
import { MongoRepository } from "./MongoRepository";

export class RepositoryFactory {

    createRepository(): IRepository{

        switch(process.env.DB_ADAPTER){
            case "mysql":
                const mysql: MysqlRepository = new MysqlRepository();
                return mysql;
            case "mongo":
                const mongo: MongoRepository = new MongoRepository();
                return mongo;
            default:
                throw new Error("Invalid Repository type: " + process.env.DB_ADAPTER + ", please check the DB_ADAPTER property in '.env' or implement the new Repository");   
        }
    }
}