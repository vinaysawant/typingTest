/**
 * Created by vinay on 30/12/15.
 */
var app = angular.module("typingApp", []);


app.factory('Paragraph', function () {

    var paragraph = {};

    paragraph.paragraph = ['' +
    'Keyboards and typing technology have come a long way over the past couple centuries.' +
    ' The first typing devices were designed and patented in the 1700s while the first' +
    ' manufactured typing devices came about in the 1870s. These machines featured ' +
    '"blind typing" technology, where characters were printed on upside-down pages that ' +
    'remained unseen until completion. Since then, we have seen several updates in design,' +
    ' layout, technology, and function that are more efficient and user-friendly.' +
    ' The type-writer has changed shape dramatically over the years, eventually becoming' +
    ' electronic- then practically obsolete as we moved into the age of computers and the' +
    ' birth of the keyboard. The keyboard is the number one computer interface used around ' +
    'the world, and an integral object for many of us that most people take for granted. ' +
    'This paper will explore the history of typing, detailing the innovations across time ' +
    'that have accumulated  into the definition of today’s standard for the ultimate typing' +
    ' experience.'];

    paragraph.getParagraph = function (key) {
        return paragraph.paragraph[key];
    };

    paragraph.getSuccessKeySpan = function (letter) {
        return '<span class="typing-success" ">' + letter + '</span>';
    };

    paragraph.getFailureKeySpan = function (letter) {
        return '<span class="typing-error">' + letter + '</span>';
    };


    return paragraph;
});

app.factory('Timer',function(){

    var timer = {};

    timer.time = 2;

    timer.startTimer = function(){

    };

    timer.stopTimer = function(){

    };
});

app.controller('main_controller', ['$scope', 'Paragraph', function ($scope, Paragraph) {

    console.log("Executing main controller");

    $scope.paragraph = Paragraph.getParagraph(0);
    $scope.userText = '';

}]);


/**
 *
 * This will look for changes in scope and render html
 */
app.directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
});


/**
 *
 * Typing Directive
 */

app.directive('typingSpeed', function (Paragraph) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {

            scope._paragraph = scope.paragraph;

            scope.$watch('userText', function (newVal, oldVal) {

                var replaceString = '';

                for (var i = 0; i < newVal.length; i++) {

                    var user_letter = newVal[i];
                    var paragraph_letter = scope._paragraph[i];

                    if (paragraph_letter == user_letter) {
                        replaceString += Paragraph.getSuccessKeySpan(paragraph_letter);
                    } else {
                        replaceString += Paragraph.getFailureKeySpan(paragraph_letter);
                    }
                }

                scope.paragraph = replaceString + scope._paragraph.slice(newVal.length)

            })
        }
    };
});