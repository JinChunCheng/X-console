define([], function() {
    return ['$scope', '$state', '$stateParams', 'projectService', 'assetService', 'borrowerService', 'metaService', 'toaster',
        function($scope, $state, $stateParams, projectService, assetService, borrowerService, metaService, toaster) {

            $scope.projectVM = {
                data: { status: 'NEW', durationUnit: 'D', interestRateTerm: 'Y', serviceFeeRateTerm: 'Y' },
                // data: {
                //     "status": "NEW",
                //     "durationUnit": "D",
                //     "interestRateTerm": "Y",
                //     "serviceFeeRateTerm": "Y",
                //     "creditChannelId": 1,
                //     "creditAccountManagerId": 1,
                //     "borrowerId": "58",
                //     "prodTypeId": "0101",
                //     "projectType": "NOR",
                //     "projectName": "YHY第一标",
                //     "contractTemplateId": "1",
                //     "displayChannelCode": "CASHBOXONE",
                //     "repaymentType": "ETP",
                //     "requestAmount": 1000000,
                //     "duration": 128,
                //     "interestRate": 15,
                //     "serviceFeeRate": 1,
                //     "biddingStartAmount": 1000,
                //     "biddingStepAmount": 1000,
                //     "biddingEndAmount": 100000,
                //     "biddingDeadline": "2016-09-15T16:00:00.000Z",
                //     "autoApprove": "B",
                //     "purpose": "s",
                //     "description": "ss",
                //     "guaranteeFlag": "Y",
                //     "guarantee": "sss",
                //     "mortgageFlag": "Y",
                //     "mortgage": "ssss",
                //     "memo": "sssss"
                // },
                creditChannelList: [],
                getManagerList: function() {
                    var result = [];
                    if (!$scope.projectVM.data.creditChannelId)
                        return result;
                    $scope.projectVM.creditChannelList.forEach(function(item) {
                        if (item.value == $scope.projectVM.data.creditChannelId) {
                            result = item.children;
                        }
                    });
                    return result;
                },
                refreshBorrower: refreshBorrower,
                submit: submit
            };

            (function() {
                assetService.platform.query({ where: JSON.stringify({ data: { status: 1 }, paginate: { pageNum: 1, pageSize: 200 } }) }).$promise.then(function(res) {
                    if (res.code == 200)
                        $scope.projectVM.saleplatformList = res.data.items || [];
                    else
                        toaster.pop('error', res.msg);
                });
                metaService.getMeta('SXQD', function(items) {
                    $scope.projectVM.creditChannelList = items;
                });
                metaService.getMeta('CPLX', function(items) {
                    $scope.projectVM.productTypeList = items;
                });
                metaService.getMeta('XMLX', function(items) {
                    $scope.projectVM.projectTypeList = items;
                });
                metaService.getMeta('YOUWU', function(items) {
                    $scope.projectVM.youwuList = items;
                });
                metaService.getMeta('HTMB', function(items) {
                    $scope.projectVM.contractList = items;
                });
                metaService.getMeta('HKFS', function(items) {
                    $scope.projectVM.repaymentTypeList = items;
                });
                metaService.getMeta('JBFS', function(items) {
                    $scope.projectVM.autoApproveList = items;
                });
                metaService.getMeta('SJDW2', function(items) {
                    $scope.projectVM.timeUnitList = items;
                });
            })();

            function refreshBorrower(txt) {
                if (!txt) {
                    return;
                }
                var condition = { data: { id: txt }, paginate: { pageNum: 1, pageSize: 10 } };
                borrowerService.borrowerListTable.query({ where: JSON.stringify(condition) }).$promise.then(function(res) {
                    if (res.code == 200 && res.data) {
                        $scope.projectVM.borrowerList = res.data.items;
                    }
                });
            }

            function submit(invalid) {
                $scope.projectVM.submitted = true;
                if (invalid) {
                    return false;
                }
                projectService.project.save($scope.projectVM.data).$promise.then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '添加成功！');
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');
                });
            }

        }
    ];
});
