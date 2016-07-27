define(['service/config'], function(config) {
	return ['recommendItemService', ['$resource', '$http', '$q', function($resource, $http, $q) {
		return {
			default: {
				processing: false,
				checkedAll: false,
				paginate: {
					currentPage: 1,
					pageSize: 10,
					totalItems: 0
				}
			},
			/**
			 * 推荐位内容列表
			 * @author：fuda
			 * @param {Object} condition
			 */
			getList: function(condition) {
				return $http({
					method: 'GET',
					url: config.cms_domain + '/positionItem/list/' + condition.recommendCode + 
						'?pageNo=' +condition.pageNo + '&pageSize=' + condition.pageSize
				}).then(
					function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					}
				)
			},

			publish: function(posidionId,items,status){
				var api = status == 0 ? 'publish' : 'off';
				return $http({
						method: 'POST',
						url: config.cms_domain + '/positionItem/' + api + '/' + posidionId,
						data: items
					})
					.then(
						function(resp) {
							if (resp) {
								return resp.data;
							} else {
								return serverErrorData;
							}
						},
						function(errResp) {
							console.error('Error while add publishing positionItem.');
							return $q.reject(errResp);
						}
					);
			},

			setTop: function(itemId,isTop){
				var api = isTop == true ? 'setTop' : 'cancelTop';
				return $http({
						method: 'POST',
						url: config.cms_domain + '/positionItem/' + api + '/' + itemId
					})
					.then(
						function(resp) {
							if (resp) {
								return resp.data;
							} else {
								return serverErrorData;
							}
						},
						function(errResp) {
							console.error('Error while add publishing positionItem.');
							return $q.reject(errResp);
						}
					);
			},

			create: function(item) {
				return $http({
						method: 'POST',
						url: config.cms_domain + '/positionItem/store',
						data: item
					}).then(
						function(resp) {
							if (resp) {
								return resp.data;
							} else {
								return serverErrorData;
							}
						},
						function(errResp) {
							console.error('Error while add positionItem.');
							return $q.reject(errResp);
						}
					);
			},
			update:function(item){
				return $http({
					method: 'POST',
					url: config.cms_domain + '/positionItem/update',
					data: item
				}).then(
					function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						console.error('Error while update positionItem.');
						return $q.reject(errResp);
					}
				);
			},
			getRate: function(){
				return $http({
					method: 'GET',
					url: config.cms_domain + '/positionItem/rate',
				}).then(
					function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						console.error('Error while update positionItem.');
						return $q.reject(errResp);
					}
				);				
			},
			modifyRate: function(rate){
				return $http({
					method: 'PUT',
					url: config.cms_domain + '/positionItem/rate/modify',
					data: rate
				}).then(
					function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						console.error('Error while update positionItem.');
						return $q.reject(errResp);
					}
				);
			},
            deleteById: function(id){
                return $http({
                    method: 'POST',
                    url: config.cms_domain + '/positionItem/delete/' + id
                }).then(
                    function(resp) {
                        if (resp) {
                            return resp.data;
                        } else {
                            return serverErrorData;
                        }
                    },
                    function(errResp) {
                        console.error('Error while delete positionItem.');
                        return $q.reject(errResp);
                    }
                );
            },
			uploadFile: function(formData) {
                return $http({
                        url: config.cms_domain + '/upload/pic',
                        method: 'POST',
                        data: formData,
                        headers: {
                            //文件上传multipart必须使用空格式
                            'Content-Type': undefined
                        }
                    })
                    .then(function(res) {
                        return res ? res.data : serverErrorData;
                    }, function(res) {
                        return $q.reject(res);
                    });
            }
		};
	}]];
});