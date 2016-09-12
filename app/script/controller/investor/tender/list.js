define([], function() {
    return ['$scope','$state', '$modal', '$filter', 'metaService','investorService', 'toaster', function($scope,$state,$modal,$filter,metaService,investorService,toaster) {

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
        };

        $scope.$on('$viewContentLoaded', function() {
            $scope.listView.table = $('#tenderListTable');
        });

        function initMetaData() {
            metaService.getMeta('CZLY', function(data) {
                $scope.listView.operateOrigin = data;
            });
            metaService.getMeta('TBLBZT', function(data) {
                $scope.listView.status = data;
            });
        }
        initMetaData();

        var getData = function(params) {
            var paganition = { pageNum: params.paginate.pageNum, pageSize: params.paginate.pageSize, sort: params.data.sort };
            var condition = $scope.listView.condition;
            if(condition.data.startDate)
                condition.data.startDate = $filter('exDate')(condition.data.startDate);
            if(condition.data.endDate)
                condition.data.endDate = $filter('exDate')(condition.data.endDate);

            condition.paginate = paganition;

           // var queryCondition = { "data":data,"paginate": paganition };
            investorService.tenderList.query({ where: JSON.stringify(condition) }).$promise.then(function(res) {
                res.data = res.data || { paginate: paganition, items: [] };
                res.paginate = res.paginate || { totalCount: 0 };
                params.success({
                    total: res.data.paginate.totalCount,
                    rows: res.data.items
                });
            });
        };

        (function init() {
            initMeta();
            $scope.bsTenderListTableControl = {
                options: {
                    cache: false,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 25, 50, 100, 200],
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
                        align: 'center',
                        formatter:statusFormatter
                    }, {
                        field: 'biddingVO.biddingType',
                        title: '投标方式',
                        align: 'center',
                        formatter:biddingTypeFormatter
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
                        align: 'center',
                        formatter:operateFormatter
                    }, {
                        field: 'biddingVO.hasTrial',
                        title: '包含试投金',
                        align: 'center',
                        formatter:hasTrialFormatter
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
                            'click .btn-info': editRow,
                            'click .btn-danger': revocation
                        }
                    }]
                }
            };
            function timeFormatter(value, row, index) {
                return $filter('exDate')(value, 'yyyy-MM-dd HH:mm:ss');
            }
            function operateFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.operateList);
            }
            function hasTrialFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.hasTrialList);
            }
            function biddingTypeFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.biddingTypeList);
            }
            function statusFormatter(value, row, index) {
                return $filter('meta')(value, $scope.listView.statusList);
            }
            function flagFormatter(value, row, index) {
                var btnHtml = [
                    '<button type="button" class="btn btn-xs btn-info"><i class="fa fa-arrow-right"></i></button>',
                    '<button type="button" class="btn btn-xs btn-danger"><i class="fa fa-edit"></i></button>'
                ];
                return btnHtml.join('');
            }

        })();
        function initMeta() {
            metaService.getMeta('CZLY', function(items) {
                $scope.listView.operateList = items;
            });
            metaService.getMeta('SFXS', function(items) {
                $scope.listView.hasTrialList = items;
            });
            metaService.getMeta('TBFS', function(items) {
                $scope.listView.biddingTypeList = items;
            });
            metaService.getMeta('TBLBZT', function(items) {
                $scope.listView.statusList = items;
            });
        }
        function editRow(e, value, row, index) {
            $state.go('investor.tender.detail', { id: row.biddingVO.biddingId });

        }
        function revocation(e, value, row, index) {
            var status = row.biddingVO.status;
                if(status !='O'){
                    var text = "此标不允许撤销(只能撤销状态为待结标的标)!";
                    $modal.open({
                        templateUrl: 'view/shared/confirm.html',
                        size: 'sm',
                        controller:function($scope, $modalInstance){
                            $scope.confirmData = {
                                text: text,
                                processing: false
                            };
                            $scope.ok = function() {
                                $modalInstance.dismiss();
                                return false;
                            };
                            $scope.cancel = function() {
                                $modalInstance.dismiss();
                                return false;
                            };
                        }
                    });
                }else{
                    $state.go('investor.tender.cancel', { id:row.biddingVO.biddingId});
                    //$state.go('investor.tender.detail', { id: row.biddingVO.biddingId });
                }
        }
        $scope.search = function() {
            $scope.listView.table.bootstrapTable('refresh');
        };

        $scope.reset = function() {
            $scope.listView.condition = angular.copy(defaultCondition);
        };

    }];
});
