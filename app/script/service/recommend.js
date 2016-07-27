define(['service/config'], function(config) {
	return ['recommendService', ['$resource', '$http', '$q', function($resource, $http, $q) {
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
			 * 加载推荐位列表
			 * @author：fuda
			 * @param {Object} condition
			 */
			getList: function(condition) {
				var status = condition.status == null ? -1 : condition.status;
				return $http({
					method: 'GET',
					url: config.cms_domain + '/recommendPosition/list?pageNo=' +condition.pageNo + '&pageSize=' + condition.pageSize + '&pageCode=' + condition.pageCode + '&name=' + encodeURI(encodeURI(condition.name)) + '&status=' + status
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

			getListByPageCode: function(pageCode) {
				return $http({
					method: 'GET',
					url: config.cms_domain + '/recommendPosition/getByPageCode/' + pageCode
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

			publish: function(idList,status){
				return $http({
						method: 'POST',
						url: config.cms_domain + '/recommendPosition/publish/' + status,
						data:  idList
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
							console.error('Error while add publishing recommendPosition');
							return $q.reject(errResp);
						}
					);
			},

			getCode: function(){
				return $http({
						method: 'GET',
						url: config.cms_domain + '/recommendPosition/code',
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
							console.error('Error while add geting recommendPosition code.');
							return $q.reject(errResp);
						}
					);
			},
			create: function(position) {
				return $http({
						method: 'POST',
						url: config.cms_domain + '/recommendPosition/store',
						data: position
					}).then(
						function(resp) {
							if (resp) {
								return resp.data;
							} else {
								return serverErrorData;
							}
						},
						function(errResp) {
							console.error('Error while add recommendPosition.');
							return $q.reject(errResp);
						}
					);
			},
			update:function(position){
				return $http({
					method: 'POST',
					url: config.cms_domain + '/recommendPosition/update',
					data: position
				}).then(
					function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						console.error('Error while update recommendPosition.');
						return $q.reject(errResp);
					}
				);
			}
			
		};
	}]];
});