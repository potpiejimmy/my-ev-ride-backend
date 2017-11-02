import * as db from "../util/db";
import * as utils from "../util/utils";

/**
 * Returns the list of all cars ordered by distance
 * @return list of cars
 */
export function getCars(lon: number, lat: number): Promise<any> {
    return db.querySingle("SELECT asset.*,user.display_name FROM asset JOIN user ON asset.user_id=user.id ORDER BY (POW((lon-?),2) + POW((lat-?),2)) LIMIT 1000",
        [isNaN(lon) ? 0 : lon, isNaN(lat) ? 0 : lat]).then(res => {
        res.forEach(e => e.display_name = shortenDisplayName(e.display_name));
        return res;
    });
}

export function getCar(id: number): Promise<any> {
    return db.querySingle("SELECT * FROM asset WHERE id=?", [id]).then(res => res[0]);
}

export function getCarsForUser(user: any) {
    return db.querySingle("SELECT * FROM asset WHERE user_id=?", [user.id]);
}

export function saveCar(user: any, car: any) {
    if (car.id) {
        if (user.id !== car.user_id) throw "You are trying to update a car that is not yours.";
        return db.querySingle("UPDATE asset SET ? WHERE id=?",[car, car.id]);
    } else {
        car.user_id = user.id;
        return getCarsForUser(user).then(cars => {
            if (cars.length >= 5)
                throw "Sorry, you cannot create more than 5 cars in your account.";
            else
                return db.querySingle("INSERT INTO asset SET ?", [car]);
        });
    }
}

export function deleteCar(user: any, id: number) {
    return getCar(id).then(car => {
        if (user.id !== car.user_id) throw "You are trying to delete a car that is not yours.";
        return db.querySingle("DELETE FROM asset WHERE id=?", [id]);
    })
}

function shortenDisplayName(e: string): string {
    let spacePos = e ? e.indexOf(" ") : -1;
    if (spacePos > 0) return e.substr(0, spacePos);
    return e;
}