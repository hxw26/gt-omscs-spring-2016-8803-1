(function () {
    'use strict';

    angular
        .module('app')
        .controller('SidebarCtrl', SidebarCtrl);

    SidebarCtrl.$inject = [
        '$state',
        '$stateParams',
        'fileNames'
    ];

    function SidebarCtrl($state, $stateParams, fileNames) {
        var vm = this;

        vm.fileNames = fileNames;

        vm.selectedFile = $stateParams.file;

        vm.selectFile = selectFile;

        ////////////////

        function selectFile(fileName) {
            vm.selectedFile = fileName;

            $state.go('default', { file: fileName });
        }
    }
})();
