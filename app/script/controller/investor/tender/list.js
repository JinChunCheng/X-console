define([], function() {
    return ['$scope','$state', '$modal', 'investorService', function($scope,$state, $modal, investorService) {

        var defaultCondition = {
            data:{},
            paginate: {
                pageNum: 1,
                pageSize: 10
            }
        };

        $scope.listView = {
            condition: angular.copy(defaultCondition),
            table: null
            /*operSource: ['管理系统', '钱盒'],
            status: ['待结标', '取消', '结标完成'],
            tenderWay: ['手动投标', '自动投标', '代理投标'],
            isUsed: ['使用', '未使用']*/
        };


        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#tenderListTable');
        });


        var getData = function(params) {
            investorService.tenderList.query({ where: JSON.stringify($scope.listView.condition) }).$promise.then(function(res) {
                //console.log(res)
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
                    //data: rows,
                    // rowStyle: function(row, index) {
                    //     return { classes: 'none' };
                    // },
                    // fixedColumns: true,
                    // fixedNumber: 2,
                    cache: false,
                    //height: getHeight(),
                    //striped: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: "[10, 25, 50, 100, 200]",
                    ajax: getData,
                    //autoLoad: true,
                    //onPageChange: pageChange,
                    sidePagination: "server",
                    //search: true,
                    //showColumns: true,
                    //showRefresh: false,
                    //minimumCountColumns: 2,
                    //clickToSelect: false,
                    //showToggle: true,
                    //maintainSelected: true,
                    columns: [{
                        field: 'state',
                        checkbox: true,
                        align: 'center'
                    }, {
                        field: 'biddingVO.projectId',
                        title: '项目编号',
                        align: 'center'
                    }, {
                        field: 'biddingVO.projectName',
                        title: '项目名称',
                        align: 'center'
                    }, {
                        field: 'biddingVO.investorId',
                        title: '投资人编号',
                        align: 'center'
                    }, {
                        field: 'biddingVO.investorName',
                        title: '姓名',
                        align: 'center'
                    }, {
                        field: 'biddingVO.loginName',
                        title: '登录名',
                        align: 'center'
                    }, {
                        field: 'biddingVO.biddingAmount',
                        title: '投标金额',
                        align: 'center'
                    }, {
                        field: 'biddingVO.statusName',
                        title: '状态',
                        align: 'center'
                    }, {
                        field: 'biddingVO.biddingTypeName',
                        title: '投标方式',
                        align: 'center'
                    }, {
                        field: 'biddingDatetime',
                        title: '投标时间',
                        align: 'center'
                    }, {
                        field: 'biddingVO.op',
                        title: '代投标人',
                        align: 'center'
                    }, {
                        field: 'biddingVO.operateOriginName',
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

            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();
        function editRow(e, value, row, index) {
            //$state.go('investor.tender.detail', { id: row.biddingVO.biddingId });
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
