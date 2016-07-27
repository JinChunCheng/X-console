define(['service/config'], function(config) {
	return ['terminalService', ['$resource', '$http', '$q', function($resource, $http, $q) {
		return {
			default: {
				processing: false,
				checkedAll: false,
				channelList: [{
					value: 1,
					text: 'goexw'
				}, {
					value: 2,
					text: 'exiao'
				}],
				paginate: {
					currentPage: 1,
					pageSize: 10,
					totalItems: 0
				}
			},
			/**
			 * 加载终端列表
			 * @author：Xiaoyang.li
			 * @param {Object} condition
			 */
			getTerminals: function(condition) {
				return $http({
					method: 'POST',
					url: config.cms_domain + '/terminal/getTerminalList',
					data: condition
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
			validName: function(name){
				return $http({
					method: 'POST',
					url: config.cms_domain + '/terminal/validName',
					data: name,
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(
					function(resp){
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}						
					},
					function(){
						console.error('Error while add terminal');
						return $q.reject(errResp);
					}
				)
			},
			/**
			 * 添加终端
			 * @author：Xiaoyang.li
			 * @param {Object} terminal
			 */
			addTerminal: function(terminal) {
				return $http({
						method: 'POST',
						url: config.cms_domain + '/terminal/',
						data: terminal,
						headers: {
							'Content-Type': 'application/json'
						}
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
							console.error('Error while add terminal');
							return $q.reject(errResp);
						}
					);
			},

			/**
			 * 获取terminal code
			 * @author：Xiaoyang.li
			 */
			getTMCode: function() {
				return $http({
					method: 'GET',
					url: config.cms_domain + '/terminal/newCode'
				}).then(
					function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						console.error('Error while get terminal code.');
						return $q.reject(errResp);
					}
				)
			},

			/**
			 * 根据ID获取终端数据
			 * @author：Xiaoyang.li
			 * @param {Object} id
			 */
			getTerminalById: function(id) {
				return $http({
					method: 'GET',
					url: config.cms_domain + '/terminal/' + id,
				}).then(
					function(resp) {
						if (resp) {
							return resp.data;
						} else {
							return serverErrorData;
						}
					},
					function(errResp) {
						console.log('Error while get terminal by id.');
						return $q.reject(errResp);
					}
				)
			},

			/**
			 * 修改终端
			 * @author：Xiaoyang.li
			 * @param {Object} terminal
			 */
			modifyTerminal: function(terminal) {
				return $http({
						method: 'PUT',
						url: config.cms_domain + '/terminal/modify',
						data: terminal,
						headers: {
							'Content-Type': 'application/json'
						}
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
							console.error('Error while modifying terminal');
							return $q.reject(errResp);
						}
					);
			}

		};
	}]];
});