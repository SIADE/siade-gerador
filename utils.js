const Parse = require("parse/node")

function random_number(min, max) {
    return Math.floor(Math.random() * max + min)
}

function deleteAll(parseQuery) {
    return parseQuery.select().find().then(function(results) {
        return Parse.Object.destroyAll(results).then(function() {
            return results.length
        })
    }).then(function(count) {
        return (count)? deleteAll(parseQuery) : Parse.Promise.as();
    })
}

module.exports = {
    random_number: random_number,
    deleteAll: deleteAll
}
