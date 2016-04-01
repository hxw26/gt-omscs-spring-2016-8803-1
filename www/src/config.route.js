(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    routeConfig.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('default', {
            url: '/:file',
            views: {
                toolbar: {
                    templateUrl: 'src/components/toolbar/toolbar.tmpl.html',
                    controller: 'ToolbarCtrl',
                    controllerAs: 'vm'
                },
                sidebar: {
                    templateUrl: 'src/components/sidebar/sidebar.tmpl.html',
                    controller: 'SidebarCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        fileNames: getDataFileNames
                    }
                },
                content: {
                    templateUrl: 'src/components/content/content.tmpl.html',
                    controller: 'ContentCtrl',
                    controllerAs: 'vm',
                    resolve: {
                        data: getDataFileContent
                    }
                }
            }
        });

        $urlRouterProvider.when('/', 'default');
        $urlRouterProvider.otherwise('/');
    }

    getDataFileNames.$inject = [
        'dataService'
    ];

    function getDataFileNames(dataService) {
        return dataService.getDataFileNames();
    }

    getDataFileContent.$inject = [
        '$stateParams',
        '$q',
        'dataService'
    ];

    function getDataFileContent($stateParams, $q, dataService) {
        if ($stateParams.file && $stateParams.file.length) {
            return dataService.getDataFileContent($stateParams.file);
        } else {
            return $q.resolve(null);
        }
    }
})();
