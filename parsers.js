export function parsePopulate(populate) {
    let q = ""
    if (populate) q += `populate=${serialize(populate.paths)}&`

    return q
}

export function parseTimebox(timebox = {}) {
    let q = ""
    if (timebox.created_after) q += `created_after=${timebox.created_after}&`
    if (timebox.created_before) q += `created_before=${timebox.created_before}&`
    if (timebox.created_prop) q += `created_prop=${timebox.created_prop}&`

    if (timebox.updated_after) q += `updated_after=${timebox.updated_after}&`
    if (timebox.updated_before) q += `updated_before=${timebox.updated_before}&`
    if (timebox.updated_prop) q += `updated_prop=${timebox.updated_prop}&`

    return q
}

export function parseFilter(filter = {}) {
    let q = ""
    if (filter.prop) q += `filter_prop=${filter.prop}&`
    if (filter.value) q += `filter_val=${filter.value}&`
    if (filter.function) q += `filter_fn=${filter.function}&`

    return q
}

export function parseSearch(search = {}) {
    let q = ""
    if (search.prop) q += `search_prop=${search.prop}&`
    if (search.value) q += `search_query=${search.value}&`
    if (search.paths) q += `search_paths=${serialize(search.paths)}&`
    if (search.caseSensitive) q += `search_case_sensitive=true&`

    return q
}

export function parseSort(sort = {}) {
    let q = ""
    if (sort.prop) q += `sort_prop=${sort.prop}&`
    if (sort.direction) q += `sort_dir=${sort.direction}&`
    if (sort.function) q += `sort_fn=${sort.function}&`

    return q
}

export function parsePaginate(paginate = {}) {
    let q = ""
    if (paginate.limit) q += `limit=${paginate.limit}&`
    if (paginate.page) q += `page=${paginate.page}&`

    return q
}

export function serialize(obj, prefix) {
    var str = [],
        p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}