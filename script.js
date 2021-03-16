// https://stackoverflow.com/a/979995
function parse_query_string(query) {
    if (0 === query.length) {
        return {}
    }
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

function normalize(text) {
    if (!text || 0 === text.length) {
        console.debug("Empty input")
        return []
    }
    values = text.split(/[ ,]+/).map(function (item) {
        return item.trim();
    });
    return _.uniq(values);
}

function get_state() {
    var musthaves = normalize(document.getElementById("musthaves").value);
    var optional = normalize(document.getElementById("optional").value);
    return {"musthaves": musthaves, "optional": optional}
}


function generate(N) {
    var state = get_state()
    console.debug("Must have:", state.musthaves)
    console.debug("Optional:", state.musthaves)
    if (N <= state.musthaves.length) {
        return state.musthaves;
    }

    result = state.musthaves
    result = result.concat(_.sample(state.optional, N - state.musthaves.length))
    return _.uniq(result)
}

function onClick() {
    result = generate(30).map(i => '#' + i)
    document.getElementById("result").innerHTML = result.join(" ")
}

function onEdit() {
    var musthaves = encodeURIComponent(document.getElementById("musthaves").value)
    var optional = encodeURIComponent(document.getElementById("optional").value)
    var query = "?musthaves=" + musthaves + "&" + "optional=" + optional;
    window.history.replaceState(null, null, query);
}



// main
(function () {

    document.getElementById("generate").addEventListener("click", onClick);
    document.getElementById("musthaves").addEventListener("keyup", onEdit);
    document.getElementById("optional").addEventListener("keyup", onEdit);

    var query = parse_query_string(window.location.search.substring(1));
    document.getElementById("musthaves").value = query.musthaves
    document.getElementById("optional").value = query.optional
    onClick()
})();