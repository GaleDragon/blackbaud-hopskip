(function (){
    "use strict";

    class BeerDetailController {
        constructor($stateParams, BeerService, BreweryApiResponseService) {
            this.beer = {};
            BeerService.detail($stateParams.id).then(beer => {
                this.beer = beer;

                this.beer.dequotedName = BreweryApiResponseService.dequote(beer.name);
                this.beer.tags = this.makeLabels(beer);
                console.log(beer);
            });
        }

        makeLabels(beer) {
            let labels = [
                {
                    text: 'Verified',
                    status: 'primary',
                    display: beer.status === 'verified'
                },
                {
                    text: `${beer.style.category.name}`,
                    status: 'default',
                    display: !!beer.style.category.name
                },
                {
                    text: 'Organic',
                    status: 'success',
                    display: beer.isOrganic
                },
                {
                    text: `${beer.available.name}`,
                    status: 'default',
                    display: beer.available.name
                }
            ];

            console.log(labels);

            return _.chain(labels).filter('display').map(l => {
                l.cls = `label-${l.status}`;
                return l;
            }).value();
        }
    }

    angular.module('hopskip.beer').controller('BeerDetailController', BeerDetailController);
}());