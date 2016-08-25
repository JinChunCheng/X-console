define(['common/config'], function(config) {
    //元数据服务
    return ['metaService', ['$http', function($http) {

        //元数据键值对
        var metas = [{
            key: 'XB', //性别
            value: [
                { value: 'male', text: '男' },
                { value: 'female', text: '女' },
                { value: 'other', text: '其他' },
            ]
        }, {
            key: 'SF', //是否
            value: [
                { value: '1', text: '是' },
                { value: '0', text: '否' }
            ]
        }, {
            key: 'YW', //有无
            value: [
                { value: '1', text: '有' },
                { value: '0', text: '无' }
            ]
        }, {
            key: 'ZCLX', //资产类型
            value: [
                { value: '1', text: '车贷' },
                { value: '2', text: '房贷' },
                { value: '3', text: '信用贷' },
                { value: '4', text: '企业贷' },
                { value: '99', text: '其他' },
            ]
        }, {
            key: 'HYZK', //婚姻状况
            value: [
                { value: '0', text: '未婚' },
                { value: '1', text: '已婚' }
            ]
        }, {
            key: 'HKLX', //户口类型
            value: [
                { value: '1', text: '城镇' },
                { value: '2', text: '农村' }
            ]
        }, {
            key: 'JYSP', //教育水平
            value: [
                { value: '1', text: '高中' },
                { value: '2', text: '中专' },
                { value: '3', text: '大专' },
                { value: '4', text: '本科' },
                { value: '5', text: '本科以上' }
            ]
        }, {
            key: 'JZQK', //居住情况
            value: [
                { value: '1', text: '租房' },
                { value: '2', text: '自有住房' },
                { value: '3', text: '父母同住' }
            ]
        }, {
            key: 'DWXZ', //单位性质
            value: [
                { value: '1', text: '私企' },
                { value: '2', text: '国企' },
                { value: '3', text: '外企' },
                { value: '4', text: '自营' }
            ]
        }, {
            key: 'QYHY', //企业行业
            value: [
                { value: '1', text: '农、林、牧、渔业' },
                { value: '2', text: '采矿业' },
                { value: '3', text: '制造业' },
                { value: '4', text: '电力、热力、燃气及水的生产和供应业' },
                { value: '5', text: '环境和公共设置管理业' },
                { value: '6', text: '建筑业' },
                { value: '7', text: '交通运输、仓储业和邮政业' },
                { value: '8', text: '信息传输、计算机服务和软件业' },
                { value: '9', text: '批发和零售业' },
                { value: '10', text: '住宿和餐饮业' },
                { value: '11', text: '金融和保险业' },
                { value: '12', text: '房地产业' },
                { value: '13', text: '租赁和商务服务业' },
                { value: '14', text: '科学研究、技术服务和地质勘查业' },
                { value: '15', text: '水利、环境和公共设施管理业' },
                { value: '16', text: '居民服务和其他服务业' },
                { value: '17', text: '教育业' },
                { value: '18', text: '卫生、社会保障和社会服务业' },
                { value: '19', text: '文化、体育和娱乐业' },
                { value: '20', text: '综合类（含投资类、主业不明显）' },
                { value: '21', text: '其他' }
            ]
        }, {
            key: 'QYGM', //企业规模
            value: [
                { value: '1', text: '50人以下' },
                { value: '2', text: '50-100' },
                { value: '3', text: '100-500' },
                { value: '4', text: '500以上' },
            ]
        }, {
            key: 'JKLX', //借款类型
            value: [
                { value: '1', text: '信用类' },
                { value: '2', text: '固产类' },
                { value: '3', text: '其他' }
            ]
        }, {
            key: 'YTLB', //用途类别
            value: [
                { value: '1', text: '流动资金' },
                { value: '2', text: '固定投资' }
            ]
        }, {
            key: 'XYJB', //信用级别
            value: [
                { value: '1', text: '优质' },
                { value: '2', text: '良好' },
                { value: '3', text: '一般' },
            ]
        }, {
            key: 'HKFS', //还款方式
            value: [
                { value: '1', text: '到期还本付息' },
                { value: '2', text: '等本等费' },
                { value: '3', text: '先息后本' }
            ]
        }, {
            key: 'HKLY', //还款来源
            value: [
                { value: '1', text: '经营收入' },
                { value: '2', text: '工资收入' },
                { value: '3', text: '投资收入' }
            ]
        }, {
            key: 'CQR', //产权人
            value: [
                { value: '1', text: '本人' },
                { value: '2', text: '配偶' },
                { value: '3', text: '亲属' }
            ]
        }, {
            key: 'JBFS', //结算方式
            value: [
                { value: '1', text: '自动' },
                { value: '2', text: '手动' }
            ]
        }, {
            key: 'SJJRFS', //数据接入方式
            value: [
                { value: '1', text: '接口' },
                { value: '2', text: '数据导入' }
            ]
        }, {
            key: 'ZCQT', //支持群体
            value: [
                { value: '1', text: '个人' },
                { value: '2', text: '企业' },
                { value: '3', text: '机构' }
            ]
        }, {
            key: 'XSPTXS', //销售平台形式
            value: [
                    { value: '1', text: 'H5理财平台' },
                    { value: '2', text: 'iOS' },
                    { value: '3', text: 'Android' }
                ]
                //===============================借款人============================
        }, {
            key: 'ZT', //状态
            value: [
                { value: 'C', text: '关闭' },
                { value: 'O', text: '正常' },
            ]
        }, {
            key: 'ZHKM', //账户科目
            value: [
                { value: '1001', text: '人民币' },
            ]
        }, {
            key: 'ZHBDLX', //账户变动类型
            value: [
                { value: 'BR_NEW', text: '借款人开户' },
                { value: 'BR_REPAYMENT', text: '还款' },
                { value: 'BR_REPAYMENT_ASSIGNMENT', text: '还款分配' }
            ]
        }, {
            key: 'HKQD', //还款渠道
            value: [
                { value: 'IBOXPAY', text: '盒子支付' },
                { value: 'BANKTRANS', text: '银行转账' },
                { value: 'OTHERS', text: '其他' }
            ]
        }, {
            //===============================投资人============================
            key: 'CZLY', //操作来源
            value: [
                { value: 'CASHBOX', text: '钱盒' },
                { value: 'CONSOLE', text: '管理系统' },
            ]
        }, {
            key: 'SFRZZT', //身份认证状态
            value: [
                { value: 'Y', text: '认证通过' },
                { value: 'N', text: '认证失败' },
                { value: 'P', text: '等待认证' }
            ]
        }, {
            key: 'LCQDMC', //理财渠道名称
            value: [
                { value: '1001', text: '管理系统' },
                { value: '1002', text: '钱盒' },
                { value: '1003', text: '开通宝' }
            ]
        }, {
            key: 'LCJLBH', //理财经理姓名
            value: [
                { value: '1001', text: '管理系统' },
                { value: '2001', text: '钱盒' },
                { value: '3001', text: '开通宝' }
            ]
        }, {
            key: 'SFBGSYG', //是否本公司员工
            value: [
                { value: 'N', text: '否' },
                { value: 'Y', text: '是' },
                { value: 'P', text: '待定' }
            ]
        }, {
            key: 'CZLY', //操作来源
            value: [
                { value: 'CASHBOX', text: '钱盒' },
                { value: 'CONSOLE', text: '管理系统' },
            ]
        }, {
            key: 'ZCLX', //注册类型
            value: [
                { value: 'BACKEND', text: '代注册' },
                { value: 'ONLINE', text: '自己注册' },
            ]
        }, {
            key: 'STJZT', //试投金状态
            value: [
                { value: 'N', text: '未发放' },
                { value: 'Y', text: '已发放' },
                { value: 'R', text: '已回收' }
            ]
        }, {
            key: 'STJSFYSY', //试投金是否已使用
            value: [
                { value: 'N', text: '未使用' },
                { value: 'Y', text: '使用' },
            ]
        }, {
            //===============================资金账户============================
            key: 'ZJZHMC', //资金账户名称
            value: [
                { value: 'EGSETTLE', text: '恒丰移动金融部' },
                { value: 'EGTRUSTEE', text: '恒丰托管费' },
                { value: 'IBOXPAY', text: '盒子资金户' },
                { value: 'IBOXREPAYMENT', text: '盒子还款户' },
                { value: 'IBOXSETTLE', text: '盒子结算户' },
                { value: 'PROFIT', text: '汇和收益户' },
                { value: 'RESERVE', text: '汇和准备金户' },
                { value: 'TRUSTEE', text: '汇和托管户' },
            ]
        }, {
            key: 'RZLX', //日志类型
            value: [
                { value: 'ADD', text: '手工调增' },
                { value: 'DEPOSIT', text: '充值' },
                { value: 'LESSEN', text: '手工调减' },
                { value: 'LOAN', text: '放款' },
                { value: 'PROFIT', text: '沉淀利润' },
                { value: 'REPAYMENT', text: '还款' },
                { value: 'RESERVE', text: '风险准备金' },
                { value: 'SUPPLEMENT', text: '补充' },
                { value: 'TRUSTEE_FEE', text: '托管费' },
                { value: 'WITHDRAW', text: '提现' },
                { value: 'WITHDRAW_SERVICE_FEE', text: '提现手续费' },
            ]
        }, {
            //===============================资金管理============================
            key: 'CZQD', //充值渠道
            value: [
                { value: 'IBOXPAY', text: 'POS刷卡' },
                { value: 'OTHER', text: '其他' },
                { value: 'TRANSFER', text: '银联转账' },
            ]
        }, {
            key: 'CZLX', //充值类型
            value: [
                { value: 'ADJ', text: '调账处理' },
                { value: 'BGT', text: '网银' },
                { value: 'EAC', text: '委托扣款' },
                { value: 'OTH', text: '其他' },
                { value: 'POS', text: 'POS收款' },
                { value: 'RWD', text: '奖励' },
            ]
        }, {
            key: 'CZZT', //充值状态（区别于status）
            value: [
                { value: 'C', text: '取消' },
                { value: 'F', text: '失败' },
                { value: 'P', text: '在途' },
                { value: 'S', text: '成功' },
                { value: 'W', text: '待支付' },
            ]
        }, {
            key: 'ZCLY', //注册来源
            value: [
                { value: 'CASHBOX', text: '钱盒' },
                { value: 'CONSOLE', text: '管理系统' },
            ]
        }, {
            key: 'TXQD', //提现渠道
            value: [
                { value: 'EGBANK', text: '恒丰银行' },
                { value: 'IBOXPAY', text: '盒子支付' },
            ]
        }, {
            key: 'AQDJ', //安全等级
            value: [
                { value: 'G', text: '安全' },
                { value: 'P', text: '未计算' },
                { value: 'R', text: '危险' },
                { value: 'Y', text: '待详查' },
            ]
        }, {
            key: 'TXSHZT', //提现审核状态
            value: [
                { value: 'A', text: '批准' },
                { value: 'D', text: '拒绝' },
                { value: 'R', text: '申请' },
            ]
        }, {
            // 提现列表
            key: 'TXZT', //提现状态
            value: [
                { value: 'A', text: '批准' },
                { value: 'B', text: '回退' },
                { value: 'D', text: '拒绝' },
                { value: 'E', text: '执行完成' },
                { value: 'R', text: '申请' },
            ]
        }, {
            // 费率维护
            key: 'FLLX', //费率类型
            value: [
                { value: 'ABSOLUTE', text: '绝对值' },
                { value: 'PERCENT', text: '百分比' },
            ]
        }, {
            key: 'FLBM', //费率编码
            value: [
                { value: 'DEPOSIT', text: '充值' },
                { value: 'WITHDRAW', text: '提现' },
            ]
        }];

        //获取某项元数据列表
        var getMetaItem = function(code) {
            for (var i = 0; i < metas.length; i++) {
                if (metas[i].key.toUpperCase() == code.toUpperCase()) {
                    return metas[i].value;
                }
            }
            return null;
        };
        var provinces = [];

        return {
            getMeta: function(code, callback) {
                var value = getMetaItem(code);
                if (value != null) {
                    if (typeof callback == 'function') {
                        callback(value)
                    }
                    return false;
                }
                $http({
                        url: config.sys_domain + '/metadata/' + code,
                        method: 'GET',
                        withCredentials: false
                    })
                    .success(function(res, msg, headers, cfg) {
                        if (res && res.status == 200) {
                            //防止请求过程中已经设置了该元数据
                            if (getMetaItem(code) == null) {
                                metas.push({
                                    key: code,
                                    value: res.data
                                });
                            }
                            if (typeof callback == 'function')
                                callback(res.data);
                        } else
                            console.log(res ? ('status: ' + res.status + ', msg: ' + res.msg) : '');
                    })
                    .error(function(err, msg) {
                        console.log('request error !');
                    });
            },

            getProvinces: function(callback) {
                if (provinces && provinces.length > 0) {
                    if (typeof callback == 'function')
                        callback(provinces);
                    return false;
                }
                $http({
                        url: 'script/data/p-c-a.json',
                        //url: 'script/data/cities.json',
                        method: 'GET',
                        withCredentials: false
                    })
                    .success(function(res, msg, headers, cfg) {
                        provinces = res;
                        if (typeof callback == 'function')
                            callback(res);
                        // if (res && res.status == 200) {
                        //     provinces = res.items;
                        //     if (typeof callback == 'function')
                        //         callback(res.items);
                        // } else
                        //     console.log(res ? ('status: ' + res.status + ', msg: ' + res.msg) : '');
                    })
                    .error(function(err, msg) {
                        console.log('request error !' + err);
                    });
            }
        };
    }]];
});
