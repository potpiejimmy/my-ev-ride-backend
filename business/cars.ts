import * as db from "../util/db";
import * as utils from "../util/utils";

/**
 * Returns the list of all cars ordered by distance
 * @return list of cars
 */
export function getCars(lon: number, lat: number): Promise<any> {
    return db.querySingle("SELECT * FROM asset ORDER BY (POW((lon-?),2) + POW((lat-?),2))",[lon,lat]);
}

export function getCar(id: number): Promise<any> {
    return db.querySingle("SELECT * FROM asset WHERE id=?", [id]).then(res => res[0]);
}

export function getCarsForUser(user: any) {
    return db.querySingle("SELECT * FROM asset WHERE user_id=?", [user.id]);
}

export function saveCar(user: any, car: any) {
    car.user_id = user.id;
    if (car.id) {
        return db.querySingle("UPDATE asset SET ? WHERE id=?",[car, car.id]);
    } else {
        return db.querySingle("INSERT INTO asset SET ?", [car]);
    }
}

export function deleteCar(user: any, id: number) {
    return getCar(id).then(car => {
        if (user.id !== car.user_id) return;
        return db.querySingle("DELETE FROM asset WHERE id=?", [id]);
    })
}