define(['service/config'], function(config) {
	return ['pageService', ['$resource', '$http', '$q', function($resource, $http, $q) {
		return {
			getPagesByTerminalId: function(condition) {
				return $http({
					url: config.cms_domain + '/page/getPageList/' + condition.terminalId + '?pageSize=' + condition.pageSize + '&pageNo=' + condition.pageNo,
					method: 'GET'
				}).then(function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					});
			},
			getPagesList: function(condition) {
				return $http({
					url: config.cms_domain + '/page/getPageList',
					method: 'GET',
					data: condition
				}).then(function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					});
			},
			getPageById: function(id) {
				return $http({
					url: config.cms_domain + '/page/' + id,
					method: 'GET'
				}).then(function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					});
			},
			modifyPage: function(page) {
				return $http({
					url: config.cms_domain + '/page/modify',
					method: 'PUT',
					data: page
				}).then(function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					});
			},
			createPage: function(page) {
				return $http({
					url: config.cms_domain + '/page/',
					method: 'POST',
					data: page,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					});
			},
			offline: function(pageId) {
				return $http({
					url: config.cms_domain + '/page/offline/' + pageId,
					method: 'PUT'
				}).then(function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					});
			},
			publish: function(pageId) {
				return $http({
					url: config.cms_domain + '/page/publish/' + pageId,
					method: 'PUT'
				}).then(function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					});
			},
			/**
			 * 验证名称的唯一性
			 * @param {Object} name
			 */
			validName: function(name) {
				return $http({
					method: 'POST',
					url: config.cms_domain + '/page/validName',
					data: name,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(
					function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function() {
						console.error('Error while add terminal');
						return $q.reject(errResp);
					}
				)
			},
			getPageCode: function() {
				return $http({
					url: config.cms_domain + '/page/newCode',
					method: 'GET',
				}).then(function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						return $q.reject(errResp);
					});
			},
			/**
			 * PC 一级品类
			 * @constructor
			 */
			supplierCategory: function() {
				return $http({
						headers: {
							'Content-Type': 'application/json'
						},
						method: 'GET',
						url: config.mc_domain + '/mcCategoryByParent/0'
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
							console.error('Error while creating attribute');
							return $q.reject(errResp);
						}
					);
			}
		};
	}]];
});