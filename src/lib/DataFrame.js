export class DataFrame {
    constructor(headers, data) {
        this.headers = headers;
        this.data = data;
        this.filters = {};
        this.types = {};
        this.summary = {};

        this.determine_types();
        this.fix_types();
    }

    determine_types() {
        for (let header of this.headers) {
            if (isNaN(this.data[0][header])) {
                this.types[header] = 1; // string
            } else {
                this.types[header] = 0; // number
            }
        }
    }

    fix_types() {
        for (let row of this.data) {
            for (let col in row) {
                if (!this.types[col]) {
                    row[col] = parseFloat(row[col])
                }
            }
        }

        for (let header of this.headers) {
            if (this.types[header]) {
                this.filter(header);
            }
        }
    }

    pop(key) {
        let res = [];
        if (this.headers.includes(key)) {
            this.data.forEach(object => {
                res[key] = object[key]
                delete object[key];
            })
            
            const idx = this.headers.indexOf(key);
            this.headers.splice(idx, 1);

            delete this.filters[key];
            delete this.types[key];

            if (key in this.summary) {
                delete this.summary[key];
            }
        }

        return res
    }

    make_dummy_cols() {
        for (let header in this.filters) {
            if (this.filters[header].length > 2) {
                
                for (let i = 0; i < this.filters[header].length - 1; i++) {
                    
                    let data = [] // Get new col
                    let filter = this.filters[header][i+1];
                    let ctx_filter = `${header} (${filter})`;

                    for (let row of this.data) {
                        let new_row = {};
                        new_row[ctx_filter] = i == row[header] ? 1 : 0;

                        data.push(new_row);
                    }

                    this.append(data);

                }   
                
                for (let row of this.data) {
                    delete row[header];

                }

                const idx = this.headers.indexOf(header);
                this.headers.splice(idx, 1);
            }

        }

    }

    append(data) {
        for (let i in this.data) {
            Object.assign(this.data[i], data[i])
        }

        let new_headers = Object.keys(data[0])

        for (let new_header of new_headers) {
            this.headers.push(new_header);
        }
    }

    filter(key) {
        let categories = {}
        let filter_list = []

        for (let row of this.data) {
            if (!(row[key] in categories)) {
                categories[row[key]] = Object.keys(categories).length;
                filter_list.push(row[key])
            }
            row[key] = categories[row[key]];
        }
        
        this.filters[key] = filter_list;
    }

    rename(key, new_key) {
        if (this.headers.includes(key) && !this.headers.includes(new_key)) {
            this.data.forEach(object => {
                let val = object[key];
                object[new_key] = val;
                delete object[key];
            })
            
            const idx = this.headers.indexOf(key);
            this.headers[idx] = new_key;

            this.filters[new_key] = this.filters[key];
            this.types[new_key] = this.types[key];

            delete this.filters[key];
            delete this.types[key];
        }
    }

    summarize() {
        for (let header of this.headers) {
            let initial_value = this.data[0][header];
            this.summary[header] = {min: initial_value, max: initial_value}
        }

        for (let row of this.data) {
            for (let header in row) {
                if (row[header] < this.summary[header].min) {
                    this.summary[header].min = row[header];
                } else if (row[header] > this.summary[header].max) {
                    this.summary[header].max = row[header];
                }
            }
        }
    }

    normalize(df=this) {
        for (let row of df.data) {
            for (let header in row) {
                // x - min / (max - min)
                let diff = this.summary[header].max - this.summary[header].min
                row[header] = (row[header] - this.summary[header].min);
                if (diff !== 0) {
                    row[header] /= diff;
                }
            }
        }

        return df;
    }

    target(key) {
        let res = []
        for (let row of this.data) {
            let input = {}
            let output = {}
            for (let header in row) {
                if (header == key) {
                    output[header] = row[header];
                } else {
                    input[header] = row[header];
                }
            }
            res.push({input: input, output: output})
        }

        return res;
    }
}