import ConnectionStore from "./connection_store";

export default class Store {
    connection: ConnectionStore;

    constructor() {
        this.connection = new ConnectionStore(this);
    }
}
