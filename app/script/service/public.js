define(['common/config'], function(config) {
    return ['publicService', ['$http', '$resource', '$q', function($http, $resource, $q) {
        var serverErrorData = {
            status: 500,
            msg: '服务器连接失败，请检查服务是否可用或联系管理员！'
        };
        //查询银行数据 根据bankName模糊查询
        var bankList = $resource(config.METADATA_CONSOLE + '/bank/list', { id: "@id" }, { 'query': { isArray: false } });

        return {
            bankList: bankList,
        }
    }]]
});
