define([], function() {
    return ['$scope','$state', '$modal', '$modal','$filter', 'investorService', function($scope,$state, $modal,$filter,metaService, investorService) {

        var defaultCondition = {
            data:{},
            paginate: {
                pageNum: 1,
                pageSize: 10
            }
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null,
            add:function(){
                $state.go()
            }
        };


        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#tenderListTable');
        });


        var getData = function(params) {
            investorService.tenderList.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
                console.log(res)
                res.paginate = res.paginate || { totalCount: 0 };
                params.success({
                    total: res.paginate.totalCount,
                    rows: res.data.items,
                });
            });
        };

        (function init() {

            $scope.bsTenderListTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    sidePagination: "server",
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center'
                    }, {
                        field: 'biddingVO.projectId',
                        title: '项目编号',
                        align: 'center'
                    }, {
                        field: 'projectVO.projectName',
                        title: '项目名称',
                        align: 'center'
                    }, {
                        field: 'biddingVO.investorId',
                        title: '投资人编号',
                        align: 'center'
                    }, {
                        field: 'investorVO.name',
                        title: '姓名',
                        align: 'center'
                    }, {
                        field: 'investorVO.loginName',
                        title: '登录名',
                        align: 'center'
                    }, {
                        field: 'biddingVO.biddingAmount',
                        title: '投标金额',
                        align: 'center'
                    }, {
                        field: 'biddingVO.status',
                        title: '状态',
                        align: 'center'
                    }, {
                        field: 'biddingVO.biddingType',
                        title: '投标方式',
                        align: 'center'
                    }, {
                        field: 'biddingVO.biddingDatetime',
                        title: '投标时间',
                        align: 'center',
                        formatter:timeFormatter
                    }, {
                        field: 'biddingVO.op',
                        title: '代投标人',
                        align: 'center'
                    }, {
                        field: 'biddingVO.operateOrigin',
                        title: '操作来源',
                        align: 'center'
                    }, {
                        field: 'biddingVO.hasTrial',
                        title: '包含试投金',
                        align: 'center'
                    }, {
                        field: 'biddingVO.trialAmt',
                        title: '试投金金额',
                        align: 'center'
                    },{
                        field: 'flag',
                        title: '操作',
                        align: 'center',
                        valign: 'middle',
                        clickToSelect: false,
                        formatter: flagFormatter,
                        events: {
                            'click .btn-info': editRow
                        }
                    }]
                }
            };
            function timeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }
            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();
        function editRow(e, value, row, index) {
            //$state.go('investor.tender.detail', { id: row.biddingVO.biddingId });
            console.log(row)
            $state.go('investor.tender.detail', { id: row.biddingVO.biddingId });

        }
       /* $scope.del = function() {
            console.log('del');
        };*/

        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
            console.log('aaa');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
            console.log('aaa');
        };

       /* var pageChange = function(num, size) {
            console.log(num + ' - ' + size);
        };*/
    }];
});
