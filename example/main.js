/*
 * Toastify - Toast messages for web apps angularjs-based
 * http://github.com/
 * (c) 2013-2015 MIT License, https://likeastore.com
 */


(function() {

	var app = angular.module('app', [
		'jj.toastify',
	]);

	app.controller('prova', ['$scope', '$timeout', 'toastify', function($scope,$timeout, toastify){
		$scope.lista = [

			1,
			2,
			3,
			4, 

		];

		$scope.simpleAutoclose = function(){
			toastify.create({
				timeout: 2000, 
				message: 'Autoclosing toast',
			});
		}

		$scope.simpleError = function(){

			function alertCallback() {
				$timeout(function(){
					alert('Toast closure callback');
				});		
			}

			toastify.create({
				toastCustomClass: 'error',
				autoclose: false,
				message: 'Error message',
				callback: alertCallback
			});
		}

		$scope.successToast = function(){
			var toast = toastify.create({
				autoclose: false,
				timeout: 2000, //If autoclose is set to false, timeout automatically refers to timeount when is done
				showClose: false,
				message: 'Waiting for done...',
				doneClass: 'onDone',
				doneMessage: 'Done!'
			});

			setTimeout(function(){
				toastify.done(toast);
			}, 2000)
		}

		$scope.toastWithTemplate = function(){
			toastify.create({
				timeout: 4000, //If autoclose is set to false, timeout automatically refers to timeount when is done
				template: '<i style="color: rgb(255, 239, 153)">This is a template</i>'
			});
		}

		$scope.toastDownToBottom = function(){
			toastify.create({
				showClose: false,
				autoclose: false,
				gravity: 'bottom',
				template: '<p style="padding: 0 20px 0 20px">Click <u ng-click="closeThisToast()" style="cursor: pointer; color: rgb(255, 239, 153)">here</u> to close the toast</p>'
			})
		}

	}])

})();
