"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRightTimeNow = exports.timeLate = exports.originalTime = exports.getDateWithMuAnHAndS = exports.deleteMinutes = exports.addMinutes = void 0;
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
exports.addMinutes = addMinutes;
function deleteMinutes(date, minutes) {
    return new Date(date.getTime() - minutes * 60000);
}
exports.deleteMinutes = deleteMinutes;
function getDateWithMuAnHAndS(date_future, date_now) {
    // if (new Date(date_now) == new Date(Date.now())) {
    //     var _userOffset = date_now.getTimezoneOffset() * 60 * 1000; // user's offset time
    //     var _centralOffset = 0 * 60 * 60 * 1000; //2 for central time - use whatever you need
    //     date_now = new Date(date_now.getTime() - _userOffset + _centralOffset);
    // }
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
    var seconds = delta % 60; // in theory the modulus is not required
    if (date_now > date_future) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            left: true
        };
    }
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}
exports.getDateWithMuAnHAndS = getDateWithMuAnHAndS;
function originalTime(date_future, date_now) {
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
    var seconds = delta % 60; // in theory the modulus is not required
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        left: true
    };
}
exports.originalTime = originalTime;
function timeLate(date_future, date_now) {
    // if (new Date(date_now) == new Date(Date.now())) {
    //     var _userOffset = date_now.getTimezoneOffset() * 60 * 1000; // user's offset time
    //     var _centralOffset = 0 * 60 * 60 * 1000; //2 for central time - use whatever you need
    //     date_now = new Date(date_now.getTime() - _userOffset + _centralOffset);
    // }
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
    var seconds = delta % 60; // in theory the modulus is not required
    if (date_future > date_now) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            left: false
        };
    }
    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        left: true
    };
}
exports.timeLate = timeLate;
function setRightTimeNow(date_now) {
    var _userOffset = date_now.getTimezoneOffset() * 60 * 1000; // user's offset time
    var _centralOffset = 0 * 60 * 60 * 1000; //2 for central time - use whatever you need
    date_now = new Date(date_now.getTime() - _userOffset + _centralOffset);
    return date_now;
}
exports.setRightTimeNow = setRightTimeNow;
