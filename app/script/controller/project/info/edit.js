define([], function() {
    return ['$scope', '$state', '$filter', '$stateParams', 'projectService', 'assetService', 'borrowerService', 'metaService', 'toaster', '$modal',
        function($scope, $state, $filter, $stateParams, projectService, assetService, borrowerService, metaService, toaster, $modal) {

            $scope.projectVM = {
                data: {
                    status: 'NEW',
                    durationUnit: 'D',
                    interestRateTerm: 'Y',
                    serviceFeeRateTerm: 'Y',
                    projectBorrowerVOs: [],
                    isRecommend:'0'
                },
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
                submit: submit,
                fileSuccess: fileSuccess,
                deleteRow: deleteRow,
            };

            function deleteRow(index) {
                var parentScope = $scope;
                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    controller: function($scope, $modalInstance) {
                        $scope.confirmData = {
                            text: '确定删除？',
                            processing: false
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        $scope.ok = function() {
                            parentScope.projectVM.data.projectBorrowerVOs.splice(index, 1);
                            $modalInstance.dismiss();
                            return true;
                        }
                    }
                });
            }

            (function initMeta() {
                assetService.platform.query({ where: JSON.stringify({ data: { status: 1 }, paginate: { pageNum: 1, pageSize: 200 } }) }).$promise.then(function(res) {
                    if (res.code == 200)
                        $scope.projectVM.saleplatformList = res.data.items || [];
                    else
                        toaster.pop('error', res.msg);
                });
                metaService.getMeta('SDZT', function(items) {
                    $scope.projectVM.lockStatus = items;
                });
                metaService.getMeta('XMZCZT', function(items) {
                    $scope.projectVM.assetStatus = items;
                });
                metaService.getMeta('XMZCLX', function(items) {
                    $scope.projectVM.assetType = items;
                });
                metaService.getMeta('SFKSH', function(items) {
                    $scope.projectVM.redeemable = items;
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
                metaService.getMeta('TAGS', function(items) {
                    $scope.projectVM.tagList = items;
                });
            })();

            function fileSuccess(file, data, formData) {
                $scope.projectVM.isUploading = true;
                projectService.importAssets(formData).then(function(res) {
                    if (res.code == 200) {
                        var list = $scope.projectVM.data.projectBorrowerVOs;
                        $scope.projectVM.data.projectBorrowerVOs = list.concat(res.data);
                        console.log($scope.projectVM.data.projectBorrowerVOs)
                    } else {
                        toaster.pop('error', res.msg || '文件解析出错！');
                    }
                    $scope.projectVM.isUploading = false;
                }, function(err) {
                    toaster.pop('error', '网络连接失败！');
                    $scope.projectVM.isUploading = false;
                });
            }

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

            function getTagByValue(value, tags) {
                tags = tags || [];
                var result = null;
                tags.forEach(function(item) {
                    if (item.value == value) {
                        result = item;
                        return;
                    }
                });
                return result;
            }

            function submit(invalid) {
                $scope.projectVM.submitted = true;
                if (invalid) {
                    return false;
                }
                var borrower = $scope.projectVM.borrower;
                var projectInfo = $scope.projectVM.data;
                if (borrower) {
                    projectInfo.borrowerId = borrower.id;
                    projectInfo.borrowerName = borrower.enterpriseName;
                }
                if (projectInfo.biddingStartAmount > projectInfo.biddingEndAmount) {
                    toaster.pop('error', '投标起步金额必须小于等于投标上限金额!');
                    return false;
                }
                if (projectInfo.requestAmount < projectInfo.biddingEndAmount) {
                    toaster.pop('error', '借款需求金额必须大于等于投标上限金额!');
                    return false;
                }
                var tags = [];
                var selectedTags = $scope.projectVM.tags;
                if (selectedTags && selectedTags.length > 0) {
                    selectedTags.forEach(function(item) {
                        var tagObj = getTagByValue(item, $scope.projectVM.tagList);
                        if (tagObj)
                            tags.push(tagObj);
                    });
                }

                var projectData = $scope.projectVM.data;

                projectData.tag = angular.toJson(tags);

                projectService.project.save(projectData).$promise.then(function(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '添加成功!');
                        $state.go('project.info.list');
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {
                    toaster.pop('error', '服务器连接失败!');
                });
            }

        }
    ];
});
