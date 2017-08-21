import * as db from "../util/db";
import * as utils from "../util/utils";

/**
 * Returns the list of all booking for the given person and day
 * @param user the current user (jwt)
 * @param day a date specifying a day of the year
 * @return list of bookings
 */
export function getBookings(user: any, day: number): Promise<any> {
    return db.connection().then(connection => 
        db.query(connection, "select * from booking where person=? and day=?", [user.name, utils.removeTimeFromDate(new Date(day))]).then(res =>
            utils.asyncLoopP(res, (i,next) => {
                db.query(connection, "select * from booking_template where id=?", [i.booking_template_id]).then(res => {
                    i.booking_template = res[0];
                    next();
                });
            }).then(() => { // completed loop
                connection.release();
                return res;
            })
        )
    );
}

export function getBooking(id: number): Promise<any> {
    return db.querySingle("SELECT * FROM booking WHERE id=?", [id]).then(res => res[0]);
}

