(function () {
    "use strict";

    class BeerService {
        constructor(Restangular) {
            this.$r = Restangular;
        }

        search(options) {
            return this.$r.all('beers').getList(options);
        }

        detail(beerId) {
            return this.$r.all('beer').one(beerId).get();
        }
        
        availability() {
            return this.$r.all('menu').all('beer-availability').getList();
        }

        styles() {
            return this.$r.all('menu').all('styles').getList();
        }

        srm() {
            return this.$r.all('menu').all('srm').getList();
        }
    }

    angular.module('hopskip.beer').service('BeerService', BeerService);
}());