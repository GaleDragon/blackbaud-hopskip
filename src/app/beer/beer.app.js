(function (){
    "use strict";
    
    angular.module('hopskip.beer', []).config(($stateProvider) => {
        $stateProvider.state('hopskip.brewery', {
            url: '/breweries',
            abstract: true,
            template: '<ui-view />'
        }).state('hopskip.brewery.list', {
            url: '/list',
            templateUrl: 'app/beer/partials/brewery-list.html',
            controller: 'BreweryListController',
            controllerAs: 'ctrl'
        }).state('hopskip.brewery.detail', {
            url: '/:id',
            templateUrl: 'app/beer/partials/brewery-detail.html',
            controller: 'BreweryDetailController',
            controllerAs: 'ctrl'
        }).state('hopskip.beers', {
            url: '/beers',
            abstract: true,
            template: '<ui-view />'
        }).state('hopskip.beers.list', {
            url: '/list',
            templateUrl: 'app/beer/partials/beer-list.html',
            controller: 'BeerListController',
            controllerAs: 'ctrl'
        }).state('hopskip.beers.detail', {
            url: '/:id',
            templateUrl: 'app/beer/partials/beer-detail.html',
            controller: 'BeerDetailController',
            controllerAs: 'ctrl'
        });
    }).run(() => {});
    
}());