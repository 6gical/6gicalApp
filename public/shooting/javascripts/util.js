var _util = {};

_util.queryObj = function queryObj() {
    var result = {}, keyValuePairs = location.search.slice(1).split('&');
    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
};

_util.remove = function(list, item) {
    for (var i = list.length - 1; i >= 0; i--) {
        if (list[i] === item) {
            list.splice(i, 1);
        }
    }
};
