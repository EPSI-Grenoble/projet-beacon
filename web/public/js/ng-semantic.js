/**
 * Created by chocho on 01/10/15.
 */
app = angular.module("ngSemantic", []);

app.directive("ngPopup", [
    function() {
        return {
            restrict: "A",
            link: function(scope, elem, attr) {
                $(elem).popup();
            }
        };
    }
]);


app.directive("ngDropdown", [ "$timeout",
    function($timeout) {
        return {
            restrict: "AE",
            require: 'ngModel',
            link: function(scope, elem, attr, ngModelCtrl) {
                var option;
                attr['ngDropdown'] != "" ?  option =  scope.$eval(attr['ngDropdown']) :  option = {};
                $timeout(function () {
                    option.onChange = function (value, text, $choice) {
                        if(!attr.multiple)
                            ngModelCtrl.$setViewValue(text);
                        scope.$parent.$apply();
                    };
                    $(elem).dropdown(option);
                }, 0);
            }
        };
    }
]);

app.directive("ngOpenModal", [
    function() {
        return {
            restrict: "AE",
            link: function(scope, elem, attr) {
                $(elem).on("click", function(){
                    $("#"+attr.ngOpenModal).modal("show");
                });
            }
        };
    }
]);

app.directive("ngSticky", [
    function() {
        return {
            restrict: "AE",
            link: function(scope, elem, attr) {
                $(elem).sticky({
                    context: attr.ngSticky
                })
            }
        };
    }
]);