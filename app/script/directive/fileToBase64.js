define([], function() {
    // 数组[0]是指令的名字，数组[1][0]是需注入服务的全称,数组[1][1]是构造函数
    return ['baseSixtyFour', [function() {
        return {
            restrict: 'AC',
            scope: {
                baseSixtyFourSuccess: '&'
            },
            link: function(scope, element, attrs) {
                element.on('change', function(e) {
                    var file = this.files[0];
                    if (!file) {
                        return false;
                    }

                    //校验格式
                    var fileType = file.type;
                    //当前类型所有后缀,如image/*
                    var allType = fileType.split('/')[0] + '/*';
                    var accept = attrs.accept;
                    if (accept && accept.length > 0 && accept != allType) {
                        var acceptArr = accept.split(',');
                        var existed = false;
                        acceptArr.every(function(item) {
                            if (item == fileType) {
                                existed = true;
                                return false;
                            }
                            return true;
                        });
                        if (!existed) {
                            var typeArr = [];
                            acceptArr.forEach(function(item) {
                                typeArr.push(item.split('/')[1]);
                            });
                            alert('文件格式必须是：' + typeArr.join(' | '));
                            return false;
                        }
                    }
                    //文件最大限制(单位：M)
                    var fileMaxSize = attrs.fileMaxSize;
                    if (file.size > parseFloat(fileMaxSize) * 1024 * 1024) {
                        alert('上传文件不能超过' + fileMaxSize + 'M');
                        return false;
                    }

                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function(e) {
                        var data = this.result;
                        //validate image width, height
                        if (fileType.indexOf('image/') >= 0) {
                            var img = new Image();
                            img.src = data;
                            img.onload = function() {
                                var minWidth = attrs.imgMinWidth;
                                if (minWidth && img.width < minWidth) {
                                    alert('图片宽度不能小于:' + minWidth + '，实际宽度:' + img.width);
                                    return false;
                                }
                                var minHeight = attrs.imgMinHeight;
                                if (minHeight && img.height < minHeight) {
                                    alert('图片高度不能小于:' + minHeight + '，实际高度:' + img.height);
                                    return false;
                                }

                                if (scope.baseSixtyFourSuccess && typeof scope.baseSixtyFourSuccess == 'function') {
                                    scope.$apply(function() {
                                        var fd = new FormData();
                                        fd.append("file", file);

                                        scope.baseSixtyFourSuccess({
                                            file: file,
                                            data: data,
                                            formData: fd
                                        });
                                        //清空已选文件
                                        element.val('');
                                    });
                                }
                            };
                        }
                    }
                });
            }
        };
    }]];
});