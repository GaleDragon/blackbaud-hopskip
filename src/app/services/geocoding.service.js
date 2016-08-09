(function () {
    "use strict";

    class GeocodingService {
        constructor($q) {
            this.$q = $q;
        }

        stateForLatLong(latitude, longitude) {
            let deferred = this.$q.defer();
            let geocoder = new google.maps.Geocoder();
            let latlng = new google.maps.LatLng(latitude, longitude);

            geocoder.geocode({latLng: latlng}, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        deferred.resolve(results[1]);
                    } else {
                        deferred.resolve([]);
                    }
                } else {
                    deferred.reject(status);
                }
            });
            return deferred.promise;
        }
    }

    angular.module('hopskip').service('GeocodingService', GeocodingService);
}());