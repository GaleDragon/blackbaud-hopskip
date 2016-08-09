(function (){
    "use strict";
    
    class BreweryListController {
        constructor($scope, BreweryService, GeocodingService, $geolocation) {
            this.service = BreweryService;

            let states = [
                {
                    "name": "Alabama",
                    "abbreviation": "AL"
                },
                {
                    "name": "Alaska",
                    "abbreviation": "AK"
                },
                {
                    "name": "Arizona",
                    "abbreviation": "AZ"
                },
                {
                    "name": "Arkansas",
                    "abbreviation": "AR"
                },
                {
                    "name": "California",
                    "abbreviation": "CA"
                },
                {
                    "name": "Colorado",
                    "abbreviation": "CO"
                },
                {
                    "name": "Connecticut",
                    "abbreviation": "CT"
                },
                {
                    "name": "Delaware",
                    "abbreviation": "DE"
                },
                {
                    "name": "District Of Columbia",
                    "abbreviation": "DC"
                },
                {
                    "name": "Florida",
                    "abbreviation": "FL"
                },
                {
                    "name": "Georgia",
                    "abbreviation": "GA"
                },
                {
                    "name": "Hawaii",
                    "abbreviation": "HI"
                },
                {
                    "name": "Idaho",
                    "abbreviation": "ID"
                },
                {
                    "name": "Illinois",
                    "abbreviation": "IL"
                },
                {
                    "name": "Indiana",
                    "abbreviation": "IN"
                },
                {
                    "name": "Iowa",
                    "abbreviation": "IA"
                },
                {
                    "name": "Kansas",
                    "abbreviation": "KS"
                },
                {
                    "name": "Kentucky",
                    "abbreviation": "KY"
                },
                {
                    "name": "Louisiana",
                    "abbreviation": "LA"
                },
                {
                    "name": "Maine",
                    "abbreviation": "ME"
                },
                {
                    "name": "Maryland",
                    "abbreviation": "MD"
                },
                {
                    "name": "Massachusetts",
                    "abbreviation": "MA"
                },
                {
                    "name": "Michigan",
                    "abbreviation": "MI"
                },
                {
                    "name": "Minnesota",
                    "abbreviation": "MN"
                },
                {
                    "name": "Mississippi",
                    "abbreviation": "MS"
                },
                {
                    "name": "Missouri",
                    "abbreviation": "MO"
                },
                {
                    "name": "Montana",
                    "abbreviation": "MT"
                },
                {
                    "name": "Nebraska",
                    "abbreviation": "NE"
                },
                {
                    "name": "Nevada",
                    "abbreviation": "NV"
                },
                {
                    "name": "New Hampshire",
                    "abbreviation": "NH"
                },
                {
                    "name": "New Jersey",
                    "abbreviation": "NJ"
                },
                {
                    "name": "New Mexico",
                    "abbreviation": "NM"
                },
                {
                    "name": "New York",
                    "abbreviation": "NY"
                },
                {
                    "name": "North Carolina",
                    "abbreviation": "NC"
                },
                {
                    "name": "North Dakota",
                    "abbreviation": "ND"
                },
                {
                    "name": "Ohio",
                    "abbreviation": "OH"
                },
                {
                    "name": "Oklahoma",
                    "abbreviation": "OK"
                },
                {
                    "name": "Oregon",
                    "abbreviation": "OR"
                },
                {
                    "name": "Pennsylvania",
                    "abbreviation": "PA"
                },
                {
                    "name": "Rhode Island",
                    "abbreviation": "RI"
                },
                {
                    "name": "South Carolina",
                    "abbreviation": "SC"
                },
                {
                    "name": "South Dakota",
                    "abbreviation": "SD"
                },
                {
                    "name": "Tennessee",
                    "abbreviation": "TN"
                },
                {
                    "name": "Texas",
                    "abbreviation": "TX"
                },
                {
                    "name": "Utah",
                    "abbreviation": "UT"
                },
                {
                    "name": "Vermont",
                    "abbreviation": "VT"
                },
                {
                    "name": "Virginia",
                    "abbreviation": "VA"
                },
                {
                    "name": "Washington",
                    "abbreviation": "WA"
                },
                {
                    "name": "West Virginia",
                    "abbreviation": "WV"
                },
                {
                    "name": "Wisconsin",
                    "abbreviation": "WI"
                },
                {
                    "name": "Wyoming",
                    "abbreviation": "WY"
                }
            ];

            this.states = _.map(states, s => {
                s.title = s.name;
                return s;
            });
            
            this.gridOptions = {
                fixedToolbar: true,
                hasInlineFilters: true,
                filters: {
                    selectedState: {
                        name: "South Carolina",
                        abbreviation: "SC"
                    }
                },
                columns: [
                    {
                        caption: 'Name',
                        jsonmap: 'brewery',
                        id: 1,
                        name: 'name',
                        width_all: 500,
                        template_url: 'app/beer/partials/brewery-column.html',
                        controller: function ($scope) {
                            $scope.b = $scope.data;
                        }
                    },
                    {
                        caption: 'Address',
                        jsonmap: 'streetAddress',
                        id: 2,
                        name: 'streetAddress',
                        width_all: 400
                    },
                    {
                        caption: 'Type',
                        jsonmap: 'locationTypeDisplay',
                        id: 3,
                        name: 'locationTypeDisplay',
                        width_all: 300
                    }
                ],
                data: [],
                sortOptions: {
                    excludedColumns: ['streetAddress']
                },
                selectedColumnIds: [1,2,3]
            };

            this.paginationOptions = {};
            this.loading = false;

            $scope.$watch(() => this.gridOptions.filters, (newVal, oldVal) => {
                this.loading = true;
                this.gridOptions.filtersAreActive = newVal && newVal.selectedState;

                if (angular.isDefined(newVal)) {
                    if (newVal.selectedState) {
                        BreweryService.searchState(newVal.selectedState.name).then((results) => {
                            this.gridOptions.data = results;
                            this.paginationOptions.recordCount = results.meta.totalResults;
                            this.loading = false;
                        });
                    }
                }
            }, true);

            $scope.$on('loadMoreRows', this.loadMoreRows.bind(this));

            // My initial solution was to use google reverse geocoding to find breweries close to the user.
            // However, that would require a bit more work than I was expecting so I scaled back.

            // $geolocation.getCurrentPosition({
            //     timeout: 60000
            // }).then((position) => {
            //     return GeocodingService.stateForLatLong(position.coords.latitude, position.coords.longitude);
            // }).then((address) => {
            //     let region = _.find(address.address_components, c => c.types.includes('administrative_area_level_1'));
            //     let abbrev = region.short_name;
            //     return BreweryService.searchState(abbrev);
            // }).then(results => {
            //     console.log(results);
            // });
        }

        loadMoreRows(event, data) {
            this.gridOptions.data = this.getPaginationDataSet(data.top, data.skip);
        }

        getPaginationDataSet(top, skip) {
            console.log(top, skip);

            this.service.searchState(this.gridOptions.filters.selectedState.name).then(results => {
                this.gridOptions.data = results;
                this.paginationOptions.recordCount = results.meta.totalResults;
            })
        }
    }
    
    angular.module('hopskip.beer').controller('BreweryListController', BreweryListController);
}());