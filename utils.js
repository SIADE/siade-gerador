const Parse = require("parse/node")

function random_number(min, max) {
    return Math.floor(Math.random() * (max - min - 1) + min)
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

function range(start, edge, step) {
    // If only one number was passed in make it the edge and 0 the start.
    if (arguments.length == 1) {
        edge = start
        start = 0
    }
    // Validate the edge and step numbers.
    edge = edge || 0
    step = step || 1
    // Create the array of numbers, stopping befor the edge.
    for (var ret = []; (edge - start) * step > 0; start += step) {
        ret.push(start)
    }
    return ret
}

// Escolhe aleatoreamente de acordo com os pesos
function weighted_choice(weights){
    sum = weights.reduce(function(prev, curr){ return prev + curr })
    rnd = Math.random() * sum
    for(i in weights) {
        rnd = rnd - weights[i]
        if(rnd < 0) return Number(i)
    }
}


module.exports = {
    random_number: random_number,
    range: range,
    weighted_choice: weighted_choice,
    deleteAll: deleteAll
}
