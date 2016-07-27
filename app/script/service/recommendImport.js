define(['service/config'], function(config) {
	return ['recommendImportService', ['$resource', '$http', '$q', function($resource, $http, $q) {

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
			
			getPromotions:function(){
				
				return $http({
					url: config.mc_domain + '/promotion/all',
					method:'GET'
				}).then(function(resp){
					if(resp)return resp.data;
				},
				function(errResp){
				});
				
			},

			getProductsByCondition: function(condition) {
				return $http({
					url: config.mc_domain + '/items',
					method:'POST',
					data: condition
				}).then(
					function(resp){
						if(resp){
							return resp.data;
						}
					},
					function(errResp){
						console.log('Error while get product list from mc.');
					}
				)
			},

			importRecommend: function(data) {
				return $http({
					url: config.cms_domain + '/positionItem/batchstore',
					method: 'POST',
					data: data
				}).then(
					function(resp){
						if(resp) return resp.data;
					},
					function(errResp){
						console.log('Error while batch insert product.');
					}
				)
			}
		}

	}]];
});