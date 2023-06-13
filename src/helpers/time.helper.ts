export function addMinutes(date: Date, minutes: any)
{
    return new Date(date.getTime() + minutes * 60000);
}

export function deleteMinutes(date: Date, minutes: any)
{
    return new Date(date.getTime() - minutes * 60000);
}

export function getDateWithHoursAndMins(date_future: any, date_now: any)
{
    if (new Date(date_now) == new Date(Date.now())) {
        var _userOffset = date_now.getTimezoneOffset() * 60 * 1000; // user's offset time
        var _centralOffset = 0 * 60 * 60 * 1000; //2 for central time - use whatever you need
        date_now = new Date(date_now.getTime() - _userOffset + _centralOffset);
    }
    // get total seconds between the times
    var delta = (Math.abs(date_future - date_now) / 1000);
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // what's left is seconds
    var seconds = delta % 60;  // in theory the modulus is not required
    if (date_now > date_future) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            left: true,
        };
    }
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,

    };
}

export function originalTime(date_future: any, date_now: any)
{
    // get total seconds between the times
    var delta = (Math.abs(date_future - date_now) / 1000);
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // what's left is seconds
    var seconds = delta % 60;  // in theory the modulus is not required
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        left: true,
    };
}

export function timeLate(date_future: any, date_now: any)
{
    if (new Date(date_now) == new Date(Date.now())) {
        var _userOffset = date_now.getTimezoneOffset() * 60 * 1000; // user's offset time
        var _centralOffset = 0 * 60 * 60 * 1000; //2 for central time - use whatever you need
        date_now = new Date(date_now.getTime() - _userOffset + _centralOffset);
    }
    // get total seconds between the times
    var delta = (Math.abs(date_future - date_now) / 1000);
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // what's left is seconds
    var seconds = delta % 60;  // in theory the modulus is not required
    if (date_future > date_now) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            left: false,
        };
    }
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        left: true,
    };
}

export function setRightTimeNow(date_now: any)
{
    var _userOffset = date_now.getTimezoneOffset() * 60 * 1000; // user's offset time
    var _centralOffset = 0 * 60 * 60 * 1000; //2 for central time - use whatever you need
    date_now = new Date(date_now.getTime() - _userOffset + _centralOffset);

    return date_now;
}

