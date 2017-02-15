define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', '$modal', '$filter', 'assetService', 'metaService', 'toaster',
        function($scope, $timeout, $state, $stateParams, $modal, $filter, assetService, metaService, toaster) {
            var publishTime;
            var action = $stateParams.id ? 'edit' : 'add';
            $scope.Hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

            $scope.Minutes = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

            $scope.productVM = {
                action: action,
                title: '产品上架信息',
                data: {},
                cancel: function() {
                    $state.go('asset.release.todo');
                },
                canBeSubmitted: function() {
                    if (!$scope.productVM.data)
                        return false;
                    var status = $scope.productVM.data.status;
                    //to be on shelf or off shelf
                    return status === 0 || status === 1;
                },
                submit: submit
            };

            (function(id) {
                initMetaData();
                if (!id) {
                    return;
                }
                assetService.product.get({ id: id }).$promise.then(function(res) {
                    if (res.code == 200) {
                        var data = res.data;
                        if (data) {
                            data.publishH = new Date($filter('exDate')(data.publishTime, 'yyyy-MM-dd HH:mm:ss')).getHours() > 9 ? new Date($filter('exDate')(data.publishTime, 'yyyy-MM-dd HH:mm:ss')).getHours() : '0' + new Date($filter('exDate')(data.publishTime, 'yyyy-MM-dd HH:mm:ss')).getHours() + '';
                            data.publishM = new Date($filter('exDate')(data.publishTime, 'yyyy-MM-dd HH:mm:ss')).getMinutes() > 9 ? new Date($filter('exDate')(data.publishTime, 'yyyy-MM-dd HH:mm:ss')).getMinutes() : '0' + new Date($filter('exDate')(data.publishTime, 'yyyy-MM-dd HH:mm:ss')).getMinutes() + '';
                            data.biddingDeadline = $filter('exDate')(data.biddingDeadline);
                            $scope.productVM.data = data;
                            $scope.productVM.data.publishType = data.publishType || "I";
                            $scope.productVM.data.discountRate = (data.discountRate*100).toFixed(2);
                            $scope.productVM.data.licaiRate = (data.licaiRate*100).toFixed(2);
                            if (data.tag) {
                                var tagList = angular.fromJson(data.tag);
                                if (tagList && tagList.length > 0) {
                                    $scope.productVM.tags = tagList.map(function(item) {
                                        return item.value;
                                    });
                                }
                            }
                        }
                        if (data.saleplatformId === 0)
                            data.saleplatformId = null; //defalut value 0 will cause bug on required
                        $scope.productVM.data = data;
                    } else
                        toaster.pop('error', res.msg);
                }, function(err) {});

            })($stateParams.id);


            function initMetaData() {
                assetService.platform.query({ where: JSON.stringify({ data: { status: 1 }, paginate: { pageNum: 1, pageSize: 100 } }) }).$promise.then(function(res) {
                    if (res.code == 200) {
                        $scope.productVM.saleplatformList = res.data.items;
                    } else
                        console.log('获取销售平台失败：' + res.msg);
                }, function(err) {
                    console.log('获取销售平台失败：服务器连接错误！')
                });
                metaService.getMeta('ZCLX', function(data) {
                    $scope.productVM.assetTypeList = data;
                });
                metaService.getMeta('HKFS', function(data) {
                    $scope.productVM.repaymentTypeList = data;
                });
                metaService.getMeta('CQR', function(data) {
                    $scope.productVM.ownerList = data;
                });
                metaService.getMeta('JBFS', function(data) {
                    $scope.productVM.approveTypeList = data;
                });
                metaService.getMeta('TAGS', function(data) {
                    $scope.productVM.tagList = data;
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

            function submit(form) {

                $scope.productVM.submitted = true;
                if (form.$invalid) {
                    return false;
                }
                if ($scope.productVM.data.asset.amount) {
                    if ($scope.productVM.data.endAmount > $scope.productVM.data.asset.amount) {
                        toaster.pop('error', '上限金额不能大于借款金额！');
                        return false;
                    }
                } else if ($scope.productVM.data.endAmount > 0) {
                    toaster.pop('error', '上限金额不能大于借款金额！');
                    return false;
                }

                var data = $scope.productVM.data;

                var date = new Date();
                date = $filter('exDate')(date, 'yyyy-MM-dd');
                //处理时间
                if (data.publishType == 'T') {
                    if (data.publishTime && data.publishH != "NaN" && data.publishM != "NaN") {
                        data.publishTime = $filter('exDate')(data.publishTime, 'yyyy-MM-dd');
                        var nowTime = data.publishTime + " " + data.publishH + ":" + data.publishM + ":" + "59";
                        var date1 = $filter('exDate')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        if (new Date(nowTime.replace(/\-/g, "\/")) < new Date(date1.replace(/\-/g, "\/"))) {
                            toaster.pop('error', '投标开始日期必须大于当天日期！');
                            return false;
                        }
                    } else {
                        toaster.pop('error', '请填写完整的投标开始时间!');
                        return false;
                    }
                    if (data.publishTime > data.biddingDeadline) {
                        toaster.pop('error', '投标截止日期必须大于开始日期！');
                        return false;
                    }
                }

                if (data.biddingDeadline) {
                    data.biddingDeadline = $filter('exDate')(data.biddingDeadline, 'yyyy-MM-dd');
                    if (data.biddingDeadline < date) {
                        toaster.pop('error', '投标截止日期必须大于当天日期！');
                        return false;
                    }
                }

                if (data.startAmount >= data.endAmount) {
                    toaster.pop('error', '起投金额必须小于上限金额！');
                    return false;
                }
                if (data.saleplatformId) {
                    var saleplatformList = $scope.productVM.saleplatformList;
                    if (saleplatformList) {
                        saleplatformList.forEach(function(item) {
                            if (item.id == data.saleplatformId) {
                                data.saleplatform = item.name;
                                return;
                            }
                        });
                    }
                }
                //tags
                var tags = [];
                var selectedTags = $scope.productVM.tags;
                if (selectedTags && selectedTags.length > 0) {
                    selectedTags.forEach(function(item) {
                        var tagObj = getTagByValue(item, $scope.productVM.tagList);
                        if (tagObj)
                            tags.push(tagObj);
                    });
                }
                data.publishTime = data.publishTime + " " + data.publishH + ":" + data.publishM + ":" + "59";
                data.publishTime=new Date(data.publishTime.replace(/\-/g, "\/"));
                console.log(data.publishTime)
                data.tag = angular.toJson(tags);
                publishTime = $filter('exDate')(data.publishTime,'yyyy-MM-dd');
                data.publishType = $scope.productVM.data.publishType;
                switch ($scope.productVM.data.publishType) {
                    case 'I':
                        data.publishTime = null;
                        break;
                    case 'T':
                        console.log(data.publishTime)
                        break;
                    default:
                        break;
                }
                $modal.open({
                    templateUrl: 'view/shared/confirm.html',
                    size: 'sm',
                    controller: function($scope, $modalInstance) {
                        $scope.confirmData = {
                            text: '确定上架？',
                            processing: false
                        };
                        $scope.cancel = function() {
                            data.publishTime = publishTime;
                            $modalInstance.dismiss();
                            return false;
                        }

                        $scope.ok = function() {
                            $scope.confirmData.processing = true;
                            assetService.onshelf(data).then(function(res) {
                                if (res.code == 200) {
                                    data.publishTime = publishTime;

                                    toaster.pop('success', '产品上架成功！');
                                    $modalInstance.dismiss();
                                    $state.go('asset.release.todo');
                                } else{
                                    data.publishTime = publishTime;
                                    toaster.pop('error', res.msg);
                                }
                                $scope.confirmData.processing = false;
                            }, function(err) {
                                data.publishTime = publishTime;

                                toaster.pop('error', '服务器连接失败！');
                                $scope.confirmData.processing = false;
                            });
                            return true;
                        }
                    }
                });

            }
        }
    ];
});
