/*
 * Toastify - Toast messages for angularjs-based apps
 * https://github.com/kyashan
 * (c) 2015 MIT License 
 */

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else {
        factory(root.angular);
    }
}(this, function (angular, undefined) {
    'use strict';

    var t = angular.module('jj.toastify', []);

    var $el = angular.element;
    var scopes = {};

    t.provider('toastify', function () {
        var defaults = this.defaults = {
            toastCustomClass: null,
            appendTo: 'body',
            closeByClick: false,
            showClose: true,
            autoclose: true,
            timeout: 4000,
            message : '',
            callback: null,
            onclick: null,
            template: null,
            controller: null,
            gravity: 'top',
            doneMessage: '',
            doneClass: 'done',
            doneAutoclose: true
        };

        var globalID = 0;

        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
                var $body = $document.find('body');

                var privateMethods = {

                	appendToastContainer: function(appendTo, toastToCompile){
                			appendTo.prepend(toastToCompile);
                	},

                    //Not activated. Must be optimized
                	// centerToastContainer: function(toastContainer, toast){
                	// 	toastContainer.css('display', 'none');
                	// 	toastContainer.css('margin-left', - (toastContainer.width() / 2));
                	// 	$timeout(function(){
                	// 		toastContainer.css('display', 'block');
                	// 	}, privateMethods.getMillisFromCss(toast.css('animation-duration') || toast.css('transition-duration')))
                	// },

                	getMillisFromCss: function(duration){
                		if (!duration) return 0;
                		var s = Number(duration.replace(/s/g, ''));
                		s = s <= 1 ? s*1000 : s;
                		return s;
                		
                	},

                    performToastClose: function($toast, callback) {
                    	var id = $toast.attr('id')
                    	$($toast).addClass('exit');
                        $rootScope.$broadcast('toastify.toast-removing', {toast: $toast});
                    	$timeout(function(){
                            if ($($toast).data('callback')) $($toast).data('callback')();
                    		$toast.remove();
                            $rootScope.$broadcast('toastify.toast-removed', {toast: $toast});
                    		if (scopes[id]){
                    			scopes[id].$destroy();
                    			delete scopes[id];
                    		}
                    	}, privateMethods.getMillisFromCss($('.exit').css('animation-duration') || $('.exit').css('transition-duration')) || 0);
                    },

                    performAllToastClose: function() {
                    	var toasts = $('.toast');
                    	for (var i = toasts.length - 1; i >= 0; i--) {
                    		privateMethods.performToastClose($(toasts[i]));
                    	};
                    }

                };

                var publicMethods = {

                    create: function(params) {
                    	//Init default values
                    	var options = angular.copy(defaults);
                    	var params = params || {};
                    	angular.extend(options, params);

                    	var localID = ++globalID;
                    	var toastID = 'toast' + localID;
                    	var appendTo = $el(options.appendTo);

                    	var $close = $el('<div class="closeToast" ng-click="closeThisToast()">X</div>');
                    	var $message = $el('<div class="toastMessage">' + options.message + '</div>')
                    	var $toast = $el('<div id="' + toastID + '" class="toast"></div>');
                    	var $toastContainer = $el('<div id="toastContainer' + '_' + options.gravity + '" class="toastContainer"></div>');


                    	//Set scope
                    	var scope;
                    	if (options.scope) {
                    		scope = options.scope;
                    	} else {
                    		scope = $rootScope.$new(true);
                    	}

                    	//Store scope
                    	scopes[toastID] = scope;

                    	//Create controller if set
                    	var locals = {};
                    	if (options.controller){
                    		var ctrl = options.controller;

                            var controllerInstance = $controller(options.controller, angular.extend(
                                locals,
                                {
                                    $scope: scope,
                                    $element: $toast
                                }
                            ));
                            $toast.data('$toastifyController', controllerInstance);
                    	}

                        //Set callback
                        if (options.callback) $toast.data('callback', options.callback);

                    	//Set done message
                    	$toast.data('doneMessage', options.doneMessage);

                    	//Set done custom class
                    	$toast.data('doneClass', options.doneClass);

                    	//Set done template
                    	$toast.data('doneTemplate', options.doneTemplate);

                        //Set done timeout
                        $toast.data('timeout', options.timeout);

                        //Set done autoclose
                        $toast.data('doneAutoclose', options.doneAutoclose);


                    	//Set template if set
                    	if (options.template) $toast.append('<div class="customToastTemplate">' + options.template + '</div>');

                    	//Set message if set
                    	if (options.message) $toast.prepend($message);

                    	//Set close button if set
                    	if (options.showClose) $toast.append($close);

                        var timer;

                    	//Autoclose if set
                    	if (options.autoclose) {
                    		timer = $timeout(function(){
                    			privateMethods.performToastClose($toast);
                    		}, options.timeout);
                    	}

                        //Set done timer. This is to allow done function to cancel timeout 
                        $toast.data('timer', timer);

                    	//Close by click if set
                    	if (options.closeByClick) {
                    		$toast.bind('click', function(){ 
                    			privateMethods.performToastClose($toast);
                    		});
                    	}

                    	//Set click on entire toast if set
                    	if (options.onclick) {
                    		$toast.bind('click', function() {
                    			options.onclick($toast); //Automatically pass toastId to the function
                    		});
                    	}

                		//Set custom class if set
                		$toast.addClass(options.toastCustomClass);

                    	//Compile element
                    	var toastToCompile;
                    	if (document.querySelector('#toastContainer' + '_' + options.gravity)) {
           					toastToCompile = $compile($toast)(scope);
           					appendTo = $el('#toastContainer' + '_' + options.gravity);
                    	} else {
                    		$toastContainer.prepend($toast);
                    		$toastContainer.addClass(options.gravity);
                    		toastToCompile = $compile($toastContainer)(scope);
                    	}                    	
                    	privateMethods.appendToastContainer(appendTo, toastToCompile);
                        $rootScope.$broadcast('toastify.toast-created', {toast: $toast});


                    	scope.closeThisToast = function(){
                    		privateMethods.performToastClose($toast);
                    	};

                    	scope.getToast = function(){
                    		return $toast;
                    	};

                    	scope.closeAllToasts = function(){
                    		privateMethods.performAllToastClose();
                    	};

                    	return $toast;

                    },

                    done: function($toast){
                        $timeout.cancel($toast.data('timer'));
                    	$toast.children('.customToastTemplate').html($toast.data('doneTemplate'));
                    	var id = $($toast).attr('id');
                    	$($toast).children('.toastMessage').text($toast.data('doneMessage'));
                    	$('#' + id).addClass($toast.data('doneClass'));
                        if ($toast.data('doneAutoclose')){
                            $timeout(function(){
                                privateMethods.performToastClose($toast);
                            }, $toast.data('timeout'));
                        };
                    },

                    closeToast: function($toast){
                        $timeout(function(){
                            privateMethods.performToastClose($toast);
                        }, $toast.data('timeout'));
                    },

                    closeAllToasts: function(){
                    	privateMethods.performAllToastClose();
                    }
                };

                return publicMethods;
            }];
    });

    return t;
}));
