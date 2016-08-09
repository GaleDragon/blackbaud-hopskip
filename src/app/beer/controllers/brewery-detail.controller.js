(function (){
    "use strict";

    class BreweryDetailController {
        constructor($stateParams, $q, bbPage, BreweryService, BreweryApiResponseService) {
            this.beers = [];
            this.brewery = {};
            this.locations = [];
            this.pageStatus = bbPage.pageStatuses.LOADING;

            if (!!$stateParams.id) {
                $q.all({
                    beers: BreweryService.getBeers($stateParams.id),
                    brewery: BreweryService.detail($stateParams.id),
                    location: BreweryService.getLocation($stateParams.id)
                }).then(results => {
                    this.beers = _.map(BreweryApiResponseService.booleanize(results.beers), b => {
                        b.description = b.description || 'No Description';
                        return b;
                    });
                    this.brewery = BreweryApiResponseService.booleanize(results.brewery);

                    let locations = _.values(BreweryApiResponseService.booleanize(results.location));
                    let primary = _.find(locations, 'isPrimary');
                    this.brewery.locations = {
                        primary: primary,
                        others: _.reject(locations, 'isPrimary')
                    };

                    this.locations = locations;

                    this.map = { center: { latitude: primary.latitude, longitude: primary.longitude }, zoom: 13 };

                    this.brewery.labels = this.makeLabels(this.brewery);
                    
                    this.pageStatus = bbPage.pageStatuses.LOADED;

                });
            }
        }

        makeLabels(brewery) {
            let labels = [
                {
                    text: 'Verified',
                    status: 'primary',
                    display: brewery.status === 'verified'
                },
                {
                    text: `Established ${brewery.established}`,
                    status: 'default',
                    display: !!brewery.established
                },
                {
                    text: 'Organic',
                    status: 'success',
                    display: brewery.isOrganic
                },
                {
                    text: 'Public',
                    status: 'default',
                    display: brewery.locations.primary.openToPublic
                },
                {
                    text: 'Closed',
                    status: 'danger',
                    display: brewery.locations.primary.isClosed
                }
            ];

            console.log(labels);


            return _.chain(labels).filter('display').map(l => {
                l.cls = `label-${l.status}`;
                return l;
            }).value();
        }
    }

    angular.module('hopskip').controller('BreweryDetailController', BreweryDetailController);

}());
