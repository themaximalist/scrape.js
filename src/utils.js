function querystring(params) {
    return Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function randomElement(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error('Input must be a non-empty array');
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

module.exports = {
    querystring,
    shuffle,
    randomElement,
};