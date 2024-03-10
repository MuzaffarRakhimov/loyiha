import moment from "moment"


export default {
    equal(a, b, options) {
        if (a == b) {
            return options.fn(this)
        }

        return options.inverse(this)
    },

    getFulname(firstname, lastname) {
        return firstname.charAt(0) + lastname.charAt(0)
    },

    formatDate(date) {
        return moment(date).format('DD .MMM .YYYY')
    }
}