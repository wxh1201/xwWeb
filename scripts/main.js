require.config({

    urlArgs: "bust=" + new Date().getFullYear() + (new Date().getMonth() - 1) + new Date().getDay(),

    paths: {
        'angular': '../bower_components/angular/angular.min',
        'angular-ui-route': '../bower_components/angular-ui-router/release/angular-ui-router.min',
        'ocLazyLoad': '../bower_components/oclazyload/dist/ocLazyLoad.min',
        'angular-loading-bar': '../bower_components/angular-loading-bar/build/loading-bar.min',
        'angular-bootstrap': '../static/js/revised.angular.bootstrap',
        'angular-cookie': '../bower_components/angular-cookies/angular-cookies.min',
        'ng-file-upload': '../bower_components/ng-file-upload/ng-file-upload.min',
        'bootstrap-slider': "../bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider",
        'angular-bootstrap-slider': '../bower_components/angular-bootstrap-slider/slider',
        'domReady': '../bower_components/requirejs-domready/domReady',
        'baiduMap': '../bower_components/BaiduMapForAngularJS/baiduMap.min',
        'jquery': "../bower_components/jquery/dist/jquery.min",
        'app': 'app'

    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        }
        ,
        'angular-ui-route': {
            deps: ['angular']
        }
        ,
        'ocLazyLoad': {
            deps: ['angular']
        }
        ,
        'angular-loading-bar': {
            deps: ['angular']
        }
        ,
        'angular-bootstrap': {
            deps: ['angular']
        }
        ,
        'angular-cookie': {
            deps: ['angular']
        }
        ,
        'ng-file-upload': {
            deps: ['angular']
        }
        ,
        'angular-bootstrap-slider': {
          deps: ['angular']
        },
        'baiduMap': {
            deps: ['angular']
        }
    },

    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
})
;
