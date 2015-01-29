/* global console, require */
'use strict';

var angular = require('angular');
var fs = require('fs');
var data = require('../data');
var config = require('../../config.js');

angular.module('Demo', [])

.controller('DemoController', function($scope, $http, counters) {
    $scope.data = data;

    $scope.$watch(function() {
        counters.apply++;
        console.log('counters:', counters);
    });

    $scope.get = function() {
        $http.get('http://updates.html5rocks.com').then(function() {
            console.log('response', arguments);
        });
    };

    $scope.clickme = function() {
        console.log('nothing!');
    };

})

.value('counters', {
    apply: 0,
    filter: 0,
    func: 0
})

.filter('since', function(counters) {
    return function(value) {
        counters.filter++;
        var ddn = new Date(value);
        return (new Date()).getFullYear() - ddn.getFullYear();
    };
})

.filter('log', function() {
    function logFilter(msg) {
        console.log(msg);
        return 'log';
    }

    logFilter.$stateful = true;

    return logFilter;
})

.directive('scopeIsolate', function() {
    return {
        restrict: 'E',
        scope: {},
        template: '<div>scopeIsolate {{\'scopeIsolate filter\'|log}} </div>',
        link: function(scope) {
            scope.$watch(function() {
                console.log('watch scope: {}');
            });
        }
    };
})

.directive('scopePrivate', function() {
    return {
        restrict: 'E',
        scope: false,
        template: '<div>scopePrivate  {{\'scopePrivate filter\'|log}}</div>',
        link: function(scope) {
            scope.$watch(function() {
                console.log('watch scope: false');
            });
        }
    };
})

.directive('scopeClone', function() {
    return {
        restrict: 'E',
        scope: true,
        template: '<div>scopeClone  {{\'scopeClone filter\'|log}}</div>',
        link: function(scope) {
            scope.$watch(function() {
                console.log('watch scope: true');
            });
        }
    };
})

.directive('tableExample', function(counters) {
    return {
        restrict: 'E',
        template: fs.readFileSync(__dirname + '/example.tpl.html').toString(),
        scope: {
            data:'='
        },
        controllerAs: 'Ctrl',
        controller: function($scope, $timeout) {

            $scope.maxRows = config.maxRows;

            this.formatFirst = function(value) {
                counters.func++;
                return value.toUpperCase();
            };
            this.clickRow = function(row) {
                row.checked = true;
            };
        }
    };
});

window.loadng = function() {
    angular.bootstrap(document.getElementById('ngdemo'), ['Demo']);
};