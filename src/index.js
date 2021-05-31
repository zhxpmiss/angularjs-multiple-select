(function () {
    angular.module("multipleSelectModule", []).directive("multipleSelect", ["$rootScope", function ($rootScope) {
        return {
            restrict: "AE",
            templateUrl: "./index.html",
            scope: {
                selectList: "=",        // 下拉数据
                checkedList: "=",       // 已选的key，用于回填
                search: "@",            // 是否启用搜索 默认关闭
                key: "@",               // key 默认id
                label: "@",             // label 默认label
                disabled: "=",          // disabled 禁用
            },
            controller: function ($scope) {

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

                // 设置选中
                function setChecked() {
                    $scope.checkedList = [];
                    $scope.checkedListObj = [];
                    $scope.list.forEach(function (v) {
                        if (v.multiple_select_checked) {
                            $scope.checkedList.push(v.multiple_select_value);
                            $scope.checkedListObj.push(v);
                        }
                    });
                }

                // 删除
                $scope.del = function ($event) {
                    $event.stopPropagation();
                    if ($scope.disabled) return;
                    $scope.list.some(function (v) {
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
                    $event.stopPropagation();
                    if ($scope.disabled) return;
                    $scope.showSelect = !$scope.showSelect;
                };

                // 根据搜索条件过滤
                $scope.searchFilter = function () {
                    if ($scope.searchStr) {
                        var strReg = new RegExp($scope.searchStr);
                        $scope.filterList = $scope.list.filter(function (v) {
                            return strReg.test(v.multiple_select_label);
                        });
                    } else {
                        $scope.filterList = $scope.list;
                    }
                }

                // 格式化数据
                function formatData() {
                    // 设置默认数据
                    $scope.selectList = $scope.selectList || [];
                    $scope.checkedList = $scope.checkedList || [];
                    $scope.key = $scope.key || "id";
                    $scope.label = $scope.label || "label";
                    $scope.showSearch = $scope.search == "true"; // 使用@单项数据绑定的属性，接收到的全部是string类型，所以不能直接判断

                    // 格式化列表、处理回填
                    var list = angular.copy($scope.selectList);
                    list.forEach(function (item) {
                        item.multiple_select_value = item[$scope.key];
                        item.multiple_select_label = item[$scope.label];
                        if ($scope.checkedList && $scope.checkedList.length) {
                            item.multiple_select_checked = !($scope.checkedList.indexOf(item.multiple_select_value) < 0);
                        } else {
                            item.multiple_select_checked = false;
                        }
                    });
                    $scope.list = list;
                }

                function init() {
                    formatData();
                    $scope.searchFilter();
                }

                init();

                // 处理选择框隐藏
                function hideSelect(event) {
                    if (!(/_angularjs_multiple_select_/.test(event.target.className))) {
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
