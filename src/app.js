(function () {
    "use strict";

    angular
        .module('hopskip', [
            'ui.router',
            'restangular',
            'ui.bootstrap',
            'sky',
            'ngGeolocation',
            'uiGmapgoogle-maps',
            'templates',

            'hopskip.config',

            'hopskip.beer'
        ])
        .config(($stateProvider, $urlRouterProvider, RestangularProvider, api_key, uiGmapGoogleMapApiProvider) => {
            uiGmapGoogleMapApiProvider.configure({
                //    key: 'your api key',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization'
            });
            
            $stateProvider.state('hopskip', {
                url: '',
                abstract: true,
                templateUrl: 'app/partials/base.html'
            });

            $urlRouterProvider.otherwise('/breweries');

            RestangularProvider.setDefaultRequestParams({key: api_key});
            RestangularProvider.setBaseUrl('http://api.brewerydb.com/v2');

            RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
                var extractedData;
                if (operation === "getList") {
                    extractedData = _.isPlainObject(data.data)? _.values(data.data) : data.data || [];
                    extractedData.meta = {
                        pages: data.numberOfPages,
                        currentPage: data.currentPage,
                        status: data.status,
                        totalResults: data.totalResults
                    };
                } else {
                    extractedData = data.data;
                }
                return extractedData;
            });
        })
        .run(() => {

        })
}());