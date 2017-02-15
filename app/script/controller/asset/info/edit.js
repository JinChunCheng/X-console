define(['common/config'], function(config) {
    return ['$scope', '$timeout', '$state', '$stateParams', '$modal', '$filter', 'assetService', 'metaService', 'borrowerService', 'toaster',
        function($scope, $timeout, $state, $stateParams, $modal, $filter, assetService, metaService, borrowerService, toaster) {

            var action = $stateParams.id ? 'edit' : 'add';

            $scope.assetVM = {
                action: action,
                title: $stateParams.id ? '修改资产信息' : '新增资产信息',
                data: {},
                borrower:{},
                cancel: function() {
                    if ($scope.assetVM.showDraftBtn())
                        $state.go('asset.info.draft');
                    else
                        $state.go('asset.info.todo');
                },
                birthProvinceChange: function() {
                    $scope.assetVM.data.birthProvinceName = $scope.assetVM.getProvinceName(this.data.birthProvince);
                    console.log($scope.assetVM.data.birthProvinceName)
                    $scope.assetVM.birthCity = null;
                    $scope.assetVM.birthDistrict = null;
                    $scope.assetVM.data.birthCityName=null;
                    $scope.assetVM.data.birthDistrictName=null;

                },
                birthCityChange: function() {
                    $scope.assetVM.data.birthCityName = $scope.assetVM.getCityName(this.data.birthProvince, this.data.birthCity);
                    console.log($scope.assetVM.data.birthCityName)
                    $scope.assetVM.birthDistrict = null;
                    $scope.assetVM.data.birthDistrictName=null;
                },
                birthDistrictChange: function() {
                    $scope.assetVM.data.birthDistrictName = $scope.assetVM.getDistrictName(this.data.birthProvince, this.data.birthCity,this.data.birthDistrict);
                    console.log($scope.assetVM.data.birthDistrictName)
                },
                localProvinceChange: function() {
                    $scope.assetVM.data.localProvinceName = $scope.assetVM.getProvinceName(this.data.localProvince);
                    console.log($scope.assetVM.data.localProvinceName)
                    $scope.assetVM.localCity = null;
                    $scope.assetVM.localDistrict = null;
                    $scope.assetVM.data.localCityName=null;
                    $scope.assetVM.data.localDistrictName=null;
                },
                localCityChange: function() {
                    $scope.assetVM.data.localCityName = $scope.assetVM.getCityName(this.data.localProvince, this.data.localCity);
                    console.log($scope.assetVM.data.localCityName)
                    $scope.assetVM.data.localDistrictName=null;
                    $scope.assetVM.localDistrict = null;
                },
                localDistrictChange: function() {
                    $scope.assetVM.data.localDistrictName = $scope.assetVM.getDistrictName(this.data.localProvince, this.data.localCity,this.data.localDistrict);
                    console.log($scope.assetVM.data.localDistrictName)
                },
                showFiles: function(type, title) {
                    showFiles(type, title);
                },
                cache: function() {
                    var asset = $scope.assetVM.data;
                    date = new Date();
                    date = $filter('exDate')(date, 'yyyy-MM-dd');
                    asset.loanDate = $filter('exDate')(asset.loanDate, 'yyyy-MM-dd');
                    //处理时间
                    if (asset.loanDate) {
                        asset.loanDate = $filter('exDate')(asset.loanDate);
                        if (asset.loanDate < date) {
                            toaster.pop('error', '截止日期必须大于当天日期！');
                            return false;
                        }
                    }
                    if (!asset.assetType) {
                        toaster.pop('error', '请选择资产类型！');
                        return false;
                    }
                    if (!$scope.assetVM.borrower.id) {
                        toaster.pop('error', '请填写资产方！');
                        return false;
                    }
                    $scope.assetVM.data.status = -1;
                    saveAsset();
                },
                submit: function(invalid) {
                    var asset = $scope.assetVM.data;
                    $scope.assetVM.submitted = true;
                    var date = new Date();
                    date = $filter('exDate')(date, 'yyyy-MM-dd');
                    //处理时间
                    if (asset.loanDate) {
                        asset.loanDate = $filter('exDate')(asset.loanDate);
                        if (asset.loanDate < date) {
                            toaster.pop('error', '截止日期必须大于当天日期！');
                            return false;
                        }
                    }
                    if (invalid) {
                        return false;
                    }

                    $scope.assetVM.data.status = 0;
                    saveAsset();
                },
                provinces: [],
                getProvince: function(provinceCode) {
                    var result = [];
                    $scope.assetVM.provinces.forEach(function(item) {
                        if (item.code == provinceCode) {
                            result = item.children;
                            return;
                        }
                    });
                    return result;
                },
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
                //获取省市区名称，提供给后端
                getProvinceName: function(provinceCode) {
                    var provinceName;
                    $scope.assetVM.provinces.forEach(function(item) {
                        if (item.code == provinceCode) {
                            provinceName = item.name;
                            return;
                        }
                    });
                    return provinceName;
                },
                getCityName: function(provinceCode, cityCode) {
                    var cityName;
                    var cities = $scope.assetVM.getCities(provinceCode);
                    cities.forEach(function(item) {
                        if (item.code == cityCode) {
                            cityName = item.name;
                            return;
                        }
                    });
                    return cityName;
                },
                getDistrictName: function(provinceCode, cityCode, districtCode) {
                    var districtName;
                    var cities = $scope.assetVM.getCities(provinceCode);
                    var getDistrict = function (cityCode) {
                        var districts = [];
                        cities.forEach(function(item) {
                            if (item.code == cityCode) {
                                districts = item.children;
                                return;
                            }
                        });
                        return districts;
                    };
                    var district=getDistrict(cityCode);
                    if (district.length > 0) {
                        district.forEach(function(item) {
                            if (item.code == districtCode) {
                                districtName = item.name;
                                return;
                            }
                        });
                    }
                    return districtName;
                },
                showDraftBtn: function() {
                    return action == 'add' || $scope.assetVM.data.status == -1;
                },
                refreshBorrower: refreshBorrower
            };

            (function(id) {
                initMetaData();
                if (!id) {
                    return;
                }
                $scope.assetVM.processing = true;
                assetService.asset.get({ id: id }).$promise.then(function(res) {
                    if (res.code == 200) {
                        $scope.assetVM.data = res.data;
                        $scope.assetVM.data.loanRate = res.data.loanRate * 100;
                        $scope.assetVM.borrower = { id: res.data.borrowerId, enterpriseName: res.data.borrowerName }
                    } else
                        toaster.pop('error', '资产信息加载失败！');
                    $scope.assetVM.processing = false;
                }, function(err) {
                    toaster.pop('error', '服务器连接失败！');
                    $scope.assetVM.processing = true;
                });

            })($stateParams.id);

            function initMetaData() {
                assetService.findChannel({ data: { status: 1 }, paginate: { pageNum: 1, pageSize: 200 } }).then(function(res) {
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

            function refreshBorrower(txt) {
                if (!txt) {
                    return;
                }
                var condition = { data: { id: txt }, paginate: { pageNum: 1, pageSize: 10 } };
                borrowerService.borrowerListTable.query({ where: JSON.stringify(condition) }).$promise.then(function(res) {
                    if (res.code == 200 && res.data) {
                        $scope.assetVM.borrowerList = res.data.items;
                    }
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
                            cancel: cancel,
                            rootPath: config.FILE_READ_CONSOLE
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
                asset.borrowerId = $scope.assetVM.borrower.id;
                asset.borrowerName = $scope.assetVM.borrower.enterpriseName;
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
