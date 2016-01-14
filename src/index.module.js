(function () {
  'use strict';

  var angularModules = [
    'ngSanitize'
  ];

  var otherModules = [
    'gettext',
    'helion.framework',
    'ui.bootstrap',
    'ui.router'
  ];

  var pluginModules = Object.keys(env.plugins).map(function (key) {
    return env.plugins[key].moduleName;
  });

  angular
    .module('green-box-console', ['app'].concat(angularModules, otherModules, pluginModules), config);

  config.$inject = [
    '$compileProvider'
  ];

  function config($compileProvider) {

    /**
     * Disabling Debug Data
     *
     * To manually enable debug data, open up a debug console in the browser
     * then call this method directly in this console:
     *
     * ```
     * angular.reloadWithDebugInfo();
     * ```
     *
     * https://docs.angularjs.org/guide/production
     */
    $compileProvider.debugInfoEnabled(false);
  }

})();
