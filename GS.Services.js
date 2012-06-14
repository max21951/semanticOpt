var maxProfileFieldsCount = 10;
String.prototype.noWhite = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

//Object to array
function dictToArray(object, sortFunc) {
    var rv = [];
    for (var k in object) {
        if (object.hasOwnProperty(k)) rv.push({ key: k, value: object[k] });
    }
    rv.sort(function (o1, o2) {
        return o1.value < o2.value;
    });
    return rv;
}

////Array to obj
//function arrayToDict(ar) {
//    var obj = new Object();
//    for (var k in ar) {
//        obj[k['key']] = k['value'];
//      //  if (object.hasOwnProperty(k)) rv.push({ key: k, value: object[k] });
//    }
//    return obj;
//}
function arrayToStr(ar) {
    console.log('arrayToStr', ar);
    var a= '';
    for ( k in ar) {
        a += ar[k].key + ':' + ar[k].value + ' '; 
    }
    return a.noWhite();
}




function profileToDict(str) {
    //var profileArray = new Array();
    //var profileArray = if str.split(' ');
    var result = Object();
    if ('string' === typeof str) {
        $.each(str.split(' '), function (i, e) {
            console.log('profiletodict, ' + e);
            var tmp = e.split(':');
            result[tmp[0]] = (tmp[1] != null) ? tmp[1] : 0;
        });
    }
    console.log(result);
    return result;
}

function dictToStr(dict) {
    var str = '';
    for (key in dict) {
        str += key + ':' + dict[key] + ' ';
    }
    return str.noWhite();
}
