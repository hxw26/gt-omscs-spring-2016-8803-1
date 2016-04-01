(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataService', dataService);

    dataService.$inject = [
        '$q',
        '$http',
        '_'
    ];

    function dataService($q, $http, _) {
        var service = {
            dataFileNames: null,
            dataFileContents: {},

            getDataFileNames: getDataFileNames,
            getDataFileContent: getDataFileContent
        };
        return service;

        ////////////////

        function getDataFileNames() {
            return $q(function (resolve, reject) {
                if (!_.isNull(service.dataFileNames)) {
                    return resolve(service.dataFileNames);
                }

                function success(response) {
                    return resolve(service.dataFileNames = response.data);
                }

                function failure(response) {
                    return reject(response.data);
                }

                $http.get('/data/files').then(success, failure);
            });
        }

        function getDataFileContent(fileName, smooth) {
            return $q(function (resolve, reject) {
                if (!_.isUndefined(service.dataFileContents[fileName])) {
                    return resolve(service.dataFileContents[fileName]);
                }

                function success(response) {
                    return resolve(service.dataFileContents[fileName] = response.data);
                }

                function failure(response) {
                    return reject(response.data);
                }

                var url = '/data/file/' + fileName;

                if (smooth) {
                    url += '?smooth=true';
                }

                $http.get(url).then(success, failure);
            });
        }
    }
})();
