(function () {
    angular.module("multipleSelectModule", []).directive("multipleSelect", ["$rootScope", "$timeout", function ($rootScope, $timeout) {
        return {
            restrict: "AE",
            templateUrl: "./index.html",
            scope: {
                selectList: "=",        // 下拉数据
                checkedList: "=",       // 已选的key，用于回填
                search: "@",            // 是否启用搜索 默认关闭
                change: "&",            // change function
                key: "@",               // key 默认id
                label: "@",             // label 默认label
                disabled: "=",          // disabled 禁用
            },
            controller: function ($scope) {

                $scope.sole = "ngms_cname" + new Date().getTime();
                var classReg = new RegExp($scope.sole + " _angularjs_multiple_select");

                // 展示下拉框
                $scope.showSelect = false;

                // 展示搜索框
                $scope.showSearch = false;

                // 搜索参数
                $scope.searchStr = "";

                // 过滤出来的列表数据
                $scope.filterList = [];

                // 选中的列表
                $scope.checkedListObj = [];

                // 全部下拉数据
                var listAll = [];

                // 设置选中
                function setChecked() {
                    $scope.checkedList = [];
                    $scope.checkedListObj = [];
                    listAll.forEach(function (v) {
                        if (v.multiple_select_checked) {
                            $scope.checkedList.push(v.multiple_select_value);
                            $scope.checkedListObj.push(v);
                        }
                    });
                    // 解决数据不同步
                    $timeout(function () {
                        $scope.change();
                    }, 0)
                }

                // 删除
                $scope.del = function ($event) {
                    // $event.stopPropagation();
                    if ($scope.disabled) return;
                    listAll.some(function (v) {
                        if (v.multiple_select_checked) {
                            v.multiple_select_checked = false;
                            return true;
                        }
                    });
                    setChecked();
                }

                // 选中、取消选中
                $scope.checkItem = function (obj, $event) {
                    $event.stopPropagation();
                    obj.multiple_select_checked = !obj.multiple_select_checked;
                    setChecked();
                }

                // 展开、收起下拉
                $scope.showSelectFn = function ($event) {
                    // $event.stopPropagation();
                    // 禁用、删除按钮时，不操作当前展示框
                    if ($scope.disabled || /_angularjs_multiple_select_chosen_item_del/.test($event.target.className)) return;
                    $scope.showSelect = !$scope.showSelect;
                };

                // 根据搜索条件过滤
                $scope.searchFilter = function () {
                    if ($scope.searchStr) {
                        var strReg = new RegExp($scope.searchStr);
                        $scope.filterList = listAll.filter(function (v) {
                            return strReg.test(v.multiple_select_label);
                        });
                    } else {
                        $scope.filterList = listAll;
                    }
                }

                // 格式化数据
                function formatData() {
                    var list = [];
                    $scope.checkedListObj = [];
                    // 设置默认数据
                    $scope.selectList = $scope.selectList || [];
                    $scope.checkedList = $scope.checkedList || [];
                    $scope.key = $scope.key || "id";
                    $scope.label = $scope.label || "label";
                    $scope.showSearch = $scope.search == "true"; // 使用@单项数据绑定的属性，接收到的全部是string类型，所以不能直接判断

                    // 格式化列表、处理回填
                    list = angular.copy($scope.selectList);
                    list.forEach(function (item) {
                        item.multiple_select_value = item[$scope.key];
                        item.multiple_select_label = item[$scope.label];
                        if ($scope.checkedList && $scope.checkedList.length) {
                            item.multiple_select_checked = !($scope.checkedList.indexOf(item.multiple_select_value) < 0);
                        } else {
                            item.multiple_select_checked = false;
                        }
                        if (item.multiple_select_checked) {
                            $scope.checkedListObj.push(item);
                        }
                    });
                    listAll = list;
                }

                function init() {
                    formatData();
                    $scope.searchFilter();
                }

                init();

                $scope.$watch("checkedList", function (n, o) {
                    JSON.stringify(n) !== JSON.stringify(o) && init();
                });

                $scope.$watch("selectList", function (n, o) {
                    JSON.stringify(n) !== JSON.stringify(o) && init();
                });

                // 处理选择框隐藏
                function hideSelect(event) {
                    if (!(classReg.test(event.target.className))) {
                        $scope.$apply(function () {
                            $scope.showSelect = false;
                        });
                    }
                }

                // 监听点击事件，不在多选上，则关闭选择框
                window.addEventListener("click", hideSelect, false);

                // 销毁时，移除监听
                $scope.$on('$destroy', function () {
                    window.removeEventListener("click", hideSelect, false)
                });

            },
            link: function (scope, element, attrs) {

            }
        }

    }]);

})();
