import {
    parsePopulate,
    parseTimebox,
    parseFilter,
    parseSearch,
    parseSort,
    parsePaginate
} from "./parsers.js";

export class API {
    constructor(base_url, options = {}) {
        this.base_url = base_url;
        this.options = options;
    }

    async request(method, url, options) {
        let opts = {
            method: method,
            headers: {
                "Content-Type":
                    options.contentType ||
                    this.options.contentType ||
                    "application/json",
                ...this.options.headers,
            },
            ...options,
        };

        if (opts.body) opts.body = JSON.stringify(opts.body);

        try {
            let res = await fetch(this.base_url + url, opts);
            if (res.status >= 200 && res.status < 300)
                return await res.json();
            else return { success: false, ...res };
        } catch (e) {
            console.error(e);
            return e;
        }
    }

    async get(url = "", options = {}) {
        return this.request("GET", url, options);
    }

    async delete(url = "", options = {}) {
        return this.request("DELETE", url, options);
    }

    async post(url = "", body = {}, options = {}) {
        options.body = body;
        return this.request("POST", url, options);
    }

    async patch(url = "", body = {}, options = {}) {
        options.body = body;
        return this.request("PATCH", url, options);
    }

    async query(url = "", query = {}) {
        const { search, filter, sort, paginate, timebox, populate } = query;

        let q = "?"
        q += parsePopulate(populate)
        q += parseTimebox(timebox)
        q += parseFilter(filter)
        q += parseSearch(search)
        q += parseSort(sort)
        q += parsePaginate(paginate)

        q = q.slice(0, -1)

        return this.get(url + q);
    }

    async populate(url = "", populate) {
        return this.query(url, { populate });
    }

    async timebox(url = "", timebox = {}) {
        return this.query(url, { timebox });
    }

    async filter(url = "", filter = {}) {
        return this.query(url, { filter });
    }

    async search(url = "", search = {}) {
        return this.query(url, { search });
    }

    async sort(url = "", sort = {}) {
        return this.query(url, { sort });
    }

    async paginate(url = "", paginate = {}) {
        return this.query(url, { paginate });
    }
}

export default API;