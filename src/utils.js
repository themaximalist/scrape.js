function querystring(params) {
    return Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
}

module.exports = {
    querystring,
};