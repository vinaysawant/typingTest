var app = angular.module("typingApp", []);

/**
 * Manages Paragraph used for typing
 * Logic to calculate speed and accuracy
 */
app.factory('Paragraph', function () {

    var paragraph = {};

    paragraph.paragraph = ['' +
    'Keyboards and typing technology have come a long way over the past couple centuries.' +
    ' The first typing devices were designed and patented in the 1700s while the first' +
    ' manufactured typing devices came about in the 1870s. These machines featured ' +
    'blind typing technology, where characters were printed on upside-down pages that ' +
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

    paragraph.calculateAccuracy = function (input) {

        var para = paragraph.getParagraph(0).split(" ");
        var words = input.split(" ");

        var successCount = 0;
        var errorCount = 0;
        var inputLength = words.length;

        for (var i = 0; i < inputLength; i++) {
            if (words[i] == para[i]) {
                successCount++;
            } else {
                errorCount++
            }
        }

        return Math.floor((successCount / inputLength) * 100);

    };

    paragraph.calculateSpeed = function (input, time) {

        var speed = {kpm: 0, wpm: 0};

        speed.kpm = Math.floor(input.length / time); //Keys per minute
        speed.wpm = Math.floor(input.split(" ").length / time); //words per minute

        return speed;

    };


    return paragraph;
});


/**
 *
 * This will look for dynamic changes in html and will render it
 */
app.directive('tyRender', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.tyRender, function (html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
});


/**
 *
 * Typing Directive:
 *
 * This watches for the input provided by user and based on login highlights the color of text
 */

app.directive('tySpeed', function (Paragraph) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {

            scope._paragraph = scope.paragraph;
            var paragraph_length = scope._paragraph.length;

            scope.$watch('userText', function (newVal, oldVal) {

                var input_text_length = newVal.length;

                if (paragraph_length > input_text_length) {

                    if (!scope.timerStatus && input_text_length > 0) {
                        scope.timerStatus = true;
                        scope.startTime();
                    }

                    var replaceString = '';

                    for (var i = 0; i < input_text_length; i++) {

                        var user_letter = newVal[i];
                        var paragraph_letter = scope._paragraph[i];

                        if (paragraph_letter == user_letter) {
                            replaceString += Paragraph.getSuccessKeySpan(paragraph_letter);
                        } else {
                            replaceString += Paragraph.getFailureKeySpan(paragraph_letter);
                        }
                    }

                    scope.paragraph = replaceString + scope._paragraph.slice(input_text_length)

                }

            })
        }
    };
});

/**
 * Main Controller :
 *  - Manages Timer and Result Modal
 */
app.controller('main_controller', ['$scope', 'Paragraph', '$interval', '$window', function ($scope, Paragraph, $interval, $window) {

    var minutes = 2;
    var seconds = 60;

    $scope.resetTest =function () {
        $scope.timerStatus = false;
        $scope.paragraph = Paragraph.getParagraph(0);
        $scope.timer = minutes * seconds;
        $scope.minutes = minutes;
        $scope.seconds = '00';
        $scope.userText = '';
        $scope.speed = {};
        console.log("in reset");
    };

    $scope.resetTest();

    $scope.startTime = function () {
        var startTimer = $interval(function () {

            $scope.timer = $scope.timer - 1;
            $scope.minutes = Math.floor($scope.timer / seconds);
            $scope.seconds = $scope.timer % seconds;

            if ($scope.timer == 0) {
                $interval.cancel(startTimer);
                $scope.accuracy = Paragraph.calculateAccuracy($scope.userText);
                $scope.speed = Paragraph.calculateSpeed($scope.userText, minutes);

                $scope.openModal();
            }
        }, 1000);
    };

    $scope.openModal = function () {
        $window.jQuery("#result_modal").modal('show');
    };

    $window.jQuery("#result_modal").on('hide.bs.modal', function () {
        $scope.resetTest();
    });


}]);
