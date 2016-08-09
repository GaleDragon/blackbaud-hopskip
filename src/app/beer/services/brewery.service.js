(function () {
    "use strict";

    class BreweryService {
        constructor(Restangular) {
            this.$r = Restangular;
        }

        detail(breweryId) {
            return this.$r.all('brewery').one(breweryId).get();
        }

        searchLocations(options, page=1) {
            options.p = page;
            return this.$r.all('locations').getList(options)
        }

        searchState(stateAbbrev, page=1) {
            return this.searchLocations({region: stateAbbrev}, page);
        }

        searchZipcode(zipcode, page=1) {
            return this.searchLocations({postalCode: zipcode}, page);
        }

        searchLocality(locality, page=1) {
            return this.searchLocations({locality: locality}, page);
        }

        getBeers(breweryId) {
            return this.$r.all('brewery').one(breweryId).getList('beers');
        }
        
        getLocation(breweryId) {
            return this.$r.all('brewery').one(breweryId).getList('locations');
        }
    }

    angular.module('hopskip.beer').service('BreweryService', BreweryService);
}());