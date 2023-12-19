
function strToDateTime(strDate) {
    
    return strDate ? strDate.substr(6, 2) + '.' + strDate.substr(4, 2) + '.' + strDate.substr(0, 4) + ' ' 
        + strDate.substr(8, 2) + ':' + strDate.substr(10, 2) + ':' + strDate.substr(12, 2) : ''
    
}

function strToDate(strDate) {
    
    return strDate ? strDate.substr(6, 2) + '.' + strDate.substr(4, 2) + '.' + strDate.substr(0, 4) : ''
    
}

function strToInputDate(strDate) {
    
    return strDate && strDate.length >= 8 ? strDate.substr(0, 4) + '-' + strDate.substr(4, 2) + '-' + strDate.substr(6, 2) : ''
    
}

function dateToObjDateTime(date) {
    
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // getMonth() is zero-based
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    var strMonth = (month < 10 ? '0' : '') + String(month)
    var strDay = (day < 10 ? '0' : '') + String(day)
    var strHour = (hour < 10 ? '0' : '') + String(hour)
    var strMinute = (minute < 10 ? '0' : '') + String(minute)
    var strSecond = (second < 10 ? '0' : '') + String(second)

    return { year: String(year), month: strMonth, day: strDay, hour: strHour, minute: strMinute, second: strSecond}

}

function dateToYMDHMS(date) {
 
    var dataobj = dateToObjDateTime(date)

    return dataobj.year + dataobj.month + dataobj.day + dataobj.hour + dataobj.minute + dataobj.second
    
}

function dateToYMD(date) {
 
    var dataobj = dateToObjDateTime(date)

    return dataobj.year + dataobj.month + dataobj.day
    
}

function dateToDMYHMS(date) {
 
    var dataobj = dateToObjDateTime(date)

    return dataobj.day + '.' + dataobj.month + '.' + dataobj.year + ' ' + dataobj.hour + ':' + dataobj.minute + ':' + dataobj.second
    
}

function objUser() {

    return { user_id: localStorage.token, user_id_str: localStorage.user }
    
}

import { v4 as uuidv4, NIL as uuid_NIL } from 'uuid'

function uuid4() {

    return uuidv4()
    
}

function uuid_nil() {

    return uuid_NIL
    
}

function isNil(param) {

    return param == uuid_NIL
    
}

export default {

    strToDateTime,
    strToDate,
    dateToObjDateTime,
    objUser,
    dateToYMDHMS,
    dateToYMD,
    dateToDMYHMS,
    strToInputDate,

    uuid4,
    uuid_nil,
    isNil

}


