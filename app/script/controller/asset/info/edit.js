define([], function() {
    return ['$scope', '$timeout', '$state', '$stateParams', '$modal', '$filter', 'assetService', 'metaService', 'toaster',
        function($scope, $timeout, $state, $stateParams, $modal, $filter, assetService, metaService, toaster) {

            var action = $stateParams.id ? 'edit' : 'add';

            $scope.assetVM = {
                action: action,
                title: $stateParams.id ? '修改资产信息' : '新增资产信息',
                data: {},
                cancel: function() {
                    if ($scope.assetVM.showDraftBtn())
                        $state.go('asset.info.draft');
                    else
                        $state.go('asset.info.todo');
                },
                birthProvinceChange: function() {
                    $scope.assetVM.birthCity = null;
                    $scope.assetVM.birthDistrict = null;
                },
                birthCityChange: function() {
                    $scope.assetVM.birthDistrict = null;
                },
                localProvinceChange: function() {
                    $scope.assetVM.localCity = null;
                    $scope.assetVM.localDistrict = null;
                },
                localCityChange: function() {
                    $scope.assetVM.localDistrict = null;
                },
                showFiles: function(type, title) {
                    showFiles(type, title);
                },
                cache: function() {
                    var asset = $scope.assetVM.data;
                    if (!asset.assetType) {
                        toaster.pop('error', '请选择资产类型！');
                        return false;
                    }
                    if (!asset.assetType) {
                        toaster.pop('error', '请选择资产类型！');
                        return false;
                    }
                    $scope.assetVM.data.status = -1;
                    saveAsset();
                },
                submit: function(invalid) {
                    $scope.assetVM.submitted = true;
                    if (invalid) {
                        return false;
                    }
                    $scope.assetVM.data.status = 0;
                    saveAsset();
                },
                provinces: [],
                getCities: function(provinceCode) {
                    var result = [];
                    $scope.assetVM.provinces.forEach(function(item) {
                        if (item.code == provinceCode) {
                            result = item.children;
                            return;
                        }
                    });
                    return result;
                },
                getDistricts: function(provinceCode, cityCode) {
                    var result = [];
                    var cities = $scope.assetVM.getCities(provinceCode);
                    if (cities.length > 0) {
                        cities.forEach(function(item) {
                            if (item.code == cityCode) {
                                result = item.children;
                                return;
                            }
                        });
                    }
                    return result;
                },
                showDraftBtn: function() {
                    return action == 'add' || $scope.assetVM.data.status == -1;
                }
            };

            (function(id) {
                initMetaData();
                if (!id) {
                    return;
                }
                $scope.assetVM.processing = true;
                assetService.asset.get({ id: id }).$promise.then(function(res) {
                    if (res.code == 200)
                        $scope.assetVM.data = res.data;
                    else
                        toaster.pop('error', '资产信息加载失败！');
                    $scope.assetVM.processing = false;
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');
                    $scope.assetVM.processing = true;
                });

            })($stateParams.id);

            function initMetaData() {
                assetService.findChannel({ data: {}, paginate: { pageNum: 1, pageSize: 2 } }).then(function(res) {
                    if (res.code == 200)
                        $scope.assetVM.channelList = res.data.items || [];
                    else
                        toaster.pop('error', res.msg);
                });
                metaService.getMeta('XB', function(data) {
                    $scope.assetVM.genderList = data;
                });
                metaService.getMeta('SF', function(data) {
                    $scope.assetVM.ynList = data;
                });
                metaService.getMeta('YW', function(data) {
                    $scope.assetVM.ywList = data;
                });
                metaService.getMeta('ZCLX', function(data) {
                    $scope.assetVM.assetTypeList = data;
                });
                metaService.getMeta('HYZK', function(data) {
                    $scope.assetVM.marriageList = data;
                });
                metaService.getProvinces(function(res) {
                    $scope.assetVM.provinces = res;
                });
                metaService.getMeta('HKLX', function(data) {
                    $scope.assetVM.hukouTypeList = data;
                });
                metaService.getMeta('JYSP', function(data) {
                    $scope.assetVM.educationList = data;
                });
                metaService.getMeta('JZQK', function(data) {
                    $scope.assetVM.livingList = data;
                });
                metaService.getMeta('DWXZ', function(data) {
                    $scope.assetVM.corpPropList = data;
                });
                metaService.getMeta('QYHY', function(data) {
                    $scope.assetVM.industryList = data;
                });
                metaService.getMeta('QYGM', function(data) {
                    $scope.assetVM.corpScaleList = data;
                });
                metaService.getMeta('JKLX', function(data) {
                    $scope.assetVM.borrowTypeList = data;
                });
                metaService.getMeta('YTLB', function(data) {
                    $scope.assetVM.useTypeList = data;
                });
                metaService.getMeta('XYJB', function(data) {
                    $scope.assetVM.creditList = data;
                });
                metaService.getMeta('HKFS', function(data) {
                    $scope.assetVM.repaymentTypeList = data;
                });
                metaService.getMeta('HKLY', function(data) {
                    $scope.assetVM.repaymentFromList = data;
                });
                metaService.getMeta('CQR', function(data) {
                    $scope.assetVM.ownerList = data;
                });
            }


            function showFiles(type, title) {
                var allFiles = $scope.assetVM.data.files || [];
                var files = $filter('filter')(allFiles, { fileUsageType: type });
                title = title || '文件列表';
                $modal.open({
                    templateUrl: 'view/asset/info/files.html',
                    size: 'lg',
                    controller: function($scope, $modalInstance) {
                        $scope.filesVM = {
                            title: title,
                            processing: false,
                            files: files,
                            fileSuccess: fileSuccess,
                            ok: ok,
                            cancel: cancel
                        };

                        function ok() {
                            saveFiles(type, $scope.filesVM.files);
                            $modalInstance.dismiss();
                        }

                        function cancel() {
                            $modalInstance.dismiss();
                            return false;
                        }

                        function fileSuccess(file, data, formData) {
                            $scope.filesVM.uploading = true;
                            assetService.upload(formData).then(function(res) {
                                if (res.code == 200) {
                                    $scope.filesVM.files.push({
                                        fileUsageType: type,
                                        originalName: file.name,
                                        filePath: res.data[file.name],
                                        fileType: file.type,
                                        fileSize: file.size
                                    });
                                } else
                                    toaster.pop('error', res.msg);
                                $scope.filesVM.uploading = false;
                            }, function(err) {
                                toaster.pop('error', '服务器连接出错！');
                                $scope.filesVM.uploading = false;
                            });
                        }
                    }
                });
            }

            function saveFiles(type, files) {
                var preFiles = $scope.assetVM.data.files || [];
                for (var i = preFiles.length - 1; i >= 0; i--) {
                    var file = preFiles[i];
                    if (file.fileUsageType == type)
                        preFiles.splice(i, 1);
                }
                $scope.assetVM.data.files = preFiles.concat(files);
            }

            function saveAsset() {
                var asset = $scope.assetVM.data;
                var channelList = $scope.assetVM.channelList;
                if (asset.assetChannelId != null && asset.assetChannelId != undefined && channelList) {
                    channelList.forEach(function(item) {
                        if (item.id == asset.assetChannelId) {
                            asset.assetChannel = item.name;
                            return;
                        }
                    });
                }
                if (asset.id)
                    assetService.asset.update({ id: asset.id }, asset).$promise.then(saveSuccess, saveError);
                else
                    assetService.asset.save(asset).$promise.then(saveSuccess, saveError);

                function saveSuccess(res) {
                    if (res.code == 200) {
                        toaster.pop('success', '资产保存成功！');
                        if ($scope.assetVM.showDraftBtn())
                            $state.go('asset.info.draft');
                        else
                            $state.go('asset.info.todo');
                    } else
                        toaster.pop('error', res.msg);
                    $scope.assetVM.saving = false;
                }

                function saveError(err) {
                    toaster.pop('error', '服务器连接失败！');
                    $scope.assetVM.saving = false;
                }
            }
        }
    ];
});
