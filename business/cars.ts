import * as db from "../util/db";
import * as utils from "../util/utils";

/**
 * Returns the list of all cars
 * @return list of cars
 */
export function getCars(): Promise<any> {
    return db.querySingle("SELECT * FROM asset");
}

export function getCar(id: number): Promise<any> {
    return db.querySingle("SELECT * FROM asset WHERE id=?", [id]).then(res => res[0]);
}

