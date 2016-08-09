(function () {
    "use strict";

    class BreweryApiResponseService {

        booleanize(object) {
            // BreweryDB returns objects with 'Y' or 'N' instead of true or false
            return _.transform(object, (res, v, k) => {
                if (['Y', 'N'].includes(v)) {
                    res[k] = v === 'Y';
                } else {
                    if (_.isPlainObject(v)) {
                        res[k] = this.booleanize(v);
                    } else if (_.isArray(v)) {
                        res[k] = _.map(v, this.booleanize.bind(this));
                    } else {
                        res[k] = v;
                    }
                }
            }, {});
        }

        dequote(str) {
            // Takes an entity name with a quoted string and returns the quoted string
            // or the original string if nothing is found
            let regex = new RegExp("[\"|\'](.*)[\"|\']");
            let res = regex.exec(str);

            return !!res? res[1] : str;
        }
    }

    angular.module('hopskip').service('BreweryApiResponseService', BreweryApiResponseService);
}());