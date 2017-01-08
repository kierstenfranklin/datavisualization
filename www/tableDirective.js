angular.module("dataVisualization")
    .directive("tableDirective", function(){
        return {
            replace: false,
            scope: {
                selectedCrimes: "=",
                pageSize: "@",
                curPage: "="
            },
            templateUrl: "tableDirective.html",
            link: function(scope){
                scope.sortType ='';
                scope.sortReverse = true;
                scope.prevPage = function(){
                    if(scope.curPage.value != 0){
                        scope.curPage.value=scope.curPage.value-1;
                    }
                }
                scope.nextPage = function(){
                    if(scope.curPage.value < scope.selectedCrimes.length/scope.pageSize - 1){
                        scope.curPage.value = scope.curPage.value+1;
                    }
                }
            }
        }
    });
