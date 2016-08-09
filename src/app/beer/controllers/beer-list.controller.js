(function (){
    "use strict";
    
    class BeerListController {
        constructor($scope, BeerService) {
            this.gridOptions = {
                fixedToolbar: true,
                hasInlineFilters: true,
                filters: {
                    availability: {
                        id : "1",
                        description : "Available year round as a staple beer.",
                        name : "Year Round"
                    }
                },
                columns: [
                    {
                        caption: 'Name',
                        jsonmap: 'link',
                        id: 1,
                        name: 'name',
                        width_all: 500,
                        template_url: 'app/beer/partials/beer-column.html'
                        
                    },
                    {
                        caption: 'ABV',
                        jsonmap: 'abv',
                        id: 2,
                        name: 'abv',
                        template_url: 'app/beer/partials/abv-column.html',
                        width_all: 400
                    },
                    {
                        caption: 'Style',
                        jsonmap: 'style',
                        id: 3,
                        template_url: 'app/beer/partials/style-column.html',
                        width_all: 300
                    }

                ],
                data: [],
                sortOptions: {
                    excludedColumns: []
                },
                selectedColumnIds: [1,2,3]
            };

            this.paginationOptions = {
                recordCount: 0
            };

            this.availabilityOptions = [];
            BeerService.availability().then(states => {
                this.availabilityOptions = states;
            });

            this.beerStyles = [];
            BeerService.styles().then(styles => {
                this.beerStyles = styles;
            });

            this.srmOptions = [];
            BeerService.srm().then(srms => {
                this.srmOptions = srms;
            });
            
            $scope.$watch(() => this.gridOptions.filters, (newVal, oldVal) => {
                this.loading = true;
                this.gridOptions.filtersAreActive = newVal && newVal.abv;

                if (angular.isDefined(newVal)) {
                    let options = {};
                    if (newVal.availability) {
                        options.availableId = newVal.availability.id;
                    }
                    if (newVal.style) {
                        options.styleId = newVal.style.id;
                    }
                    if (newVal.srm) {
                        options.srmId = newVal.srm.name;
                    }

                    if (options) {
                        BeerService.search(options).then((results) => {
                            this.paginationOptions.recordCount = results.meta.totalResults;
                            this.gridOptions.data = _.map(results, r => {
                                r.styleName = r.style.shortName;
                                r.link = { id: r.id, name: r.name };
                                return r;
                            });
                            console.log(results);
                            this.loading = false;
                        });
                    }
                }
            }, true);
        }
    }

    angular.module('hopskip.beer').controller('BeerListController', BeerListController);
}());