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

export function getCarsForUser(user: any) {
    return db.querySingle("SELECT * FROM asset WHERE user_name=?", [user.name]);
}

export function saveCar(user: any, car: any) {
    car.user_name = user.name;
    if (car.id) {
        return db.querySingle("UPDATE asset SET ? WHERE id=?",[car, car.id]);
    } else {
        return db.querySingle("INSERT INTO asset SET ?", [car]);
    }
}

export function deleteCar(user: any, id: number) {
    return getCar(id).then(car => {
        if (user.name !== car.user_name) return;
        return db.querySingle("DELETE FROM asset WHERE id=?", [id]);
    })
}