var StringUtil = {};

StringUtil.queryObj = function queryObj() {
    var result = {}, keyValuePairs = location.search.slice(1).split('&');
    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
};
