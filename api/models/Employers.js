'use strict'

class Employers {
    constructor(country_code) {
        console.log(`new Employers(country_code = ${country_code})`)
    }

    get_page(page) {
        console.log(`Employers::get_page(page = ${page})`)

        return {
            employers: [
                { id: "123", etc: "" },
                { id: "456", etc: "" }
            ],
            meta: {
                self: "/1.0/au/employers",
                previous: "/1.0/au/employers",
                next: "/1.0/au/employers/2"
            }
        }
    }

    get_employer(employer_id) {
        return {
            id: `${employer_id}`, etc: ""
        }
    }
}

module.exports = Employers
