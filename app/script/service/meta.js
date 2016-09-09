define(['common/config'], function(config) {
    //元数据服务
    return ['metaService', ['$http', function($http) {

        //元数据键值对
        var metas = [{
                key: 'XB', //性别
                value: [
                    { value: '1', text: '男' },
                    { value: '0', text: '女' }
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
                key: 'YOUWU', //有无
                value: [
                    { value: 'Y', text: '有' },
                    { value: 'N', text: '无' }
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
                    { value: '99', text: '其他' }
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
                    { value: '99', text: '其他' }
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
                    // { value: '1', text: '到期还本付息' },
                    // { value: '2', text: '等本等费' },
                    // { value: '3', text: '先息后本' }
                    { value: 'ETP', text: '等额本息' },
                    { value: 'SPM', text: '到期还本付息' },
                    { value: 'IOP', text: '每期偿还利息' }
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
                key: 'JBFS', //结标方式
                value: [
                    { value: 'A', text: '自动' },
                    { value: 'B', text: '手动' }
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
                key: 'TZRZHBDLX', //投资人账户变动类型
                value: [
                    { value: 'IV_BIDDING', text: '投标' },
                    { value: 'IV_BIDDING_OVERTIME', text: '投标逾期' },
                    { value: 'IV_BIDDING_REJECTED', text: '结标审核拒绝' },
                    { value: 'IV_DEPOSIT', text: '充值' },
                    { value: 'IV_DEPOSIT_ADJ', text: '调账充值' },
                    { value: 'IV_DEPOSIT_BGT', text: '网银充值' },
                    { value: 'IV_DEPOSIT_EAC', text: '委托充值' },
                    { value: 'IV_DEPOSIT_IPP', text: '增利宝充值' },
                    { value: 'IV_DEPOSIT_OTH', text: '其他充值' },
                    { value: 'IV_DEPOSIT_PFE', text: '花红充值' },
                    { value: 'IV_DEPOSIT_POS', text: 'POS充值' },
                    { value: 'IV_DEPOSIT_PRE', text: '预付费卡充值' },
                    { value: 'IV_DEPOSIT_RET', text: '回收试投金充值' },
                    { value: 'IV_DEPOSIT_RWD', text: '奖励充值' },
                    { value: 'IV_DEPOSIT_TRI', text: '试投金充值' },
                    { value: 'IV_INVESTMENT', text: '投资(结标审核通过)' },
                    { value: 'IV_INVESTMENT_REPAYMENT', text: '投资还款' },
                    { value: 'IV_NEW', text: '投资人开户' },
                    { value: 'IV_UNDO_BIDDING', text: '撤销投标' },
                    { value: 'IV_WITHDRAW_APPROVED', text: '提现申请通过' },
                    { value: 'IV_WITHDRAW_BACK_APPROVED', text: '提现回退申请通过' },
                    { value: 'IV_WITHDRAW_REJECTED', text: '提现申请拒绝' },
                    { value: 'IV_WITHDRAW_REQUEST', text: '提现申请' },
                ]
            }, {
                key: 'SFXS', //是否新手
                value: [
                    { value: 'Y', text: '是' },
                    { value: 'N', text: '否' },
                ]
            }, {
                key: 'LCQDMC', //理财渠道名称+理财客户经理
                value: [
                    { value: "1", code: '1001', text: '管理系统', children: [{ value: "1", code: '1001', text: '管理系统' }] },
                    { value: "2", code: '1002', text: '钱盒', children: [{ value: "1", code: '2001', text: '钱盒' }] },
                    { value: "3", code: '1003', text: '开通宝', children: [{ value: "1", code: '3001', text: '开通宝' }] }
                ]
            }, {
                key: 'LCQD', //理财渠道
                value: [
                    { value: '1', code: '1001', text: '管理系统' },
                    { value: '2', code: '1002', text: '钱盒' },
                    { value: '3', code: '1003', text: '开通宝' }
                ]
            }, {
                key: 'SXQD', //授信渠道
                value: [
                    { value: 1, code: '0001', text: '汇和金服', children: [{ value: 1, code: '1001', text: '汇和金服' }] }
                ]
            }, {
                key: 'LCJLXM', //理财经理姓名
                value: [
                    { value: '1', code: '1001', text: '管理系统' },
                    { value: '2',  code: '2001',text: '钱盒' },
                    { value: '3',  code: '3001',text: '开通宝' },
                ]
            }, {
                key: 'SFBGSYG', //是否本公司员工
                value: [
                    { value: 'N', text: '否' },
                    { value: 'Y', text: '是' },
                    { value: 'P', text: '待定' }
                ]
            },{
                key: 'TZLBZT', //投资列表状态
                value: [
                    { value: 'IRP', text: '还款中' },
                    { value: 'OVD', text: '逾期' },
                    { value: 'ECL', text: '异常关闭' },
                    { value: 'NCL', text: '正常关闭' },
                    { value: 'ITRS', text: '转让中' },
                    { value: 'TRSF', text: '转让完成' },
                ]
            }, {
                key: 'ZHUCLX', //注册类型
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
                value: [{
                    value: 'EGSETTLE',
                    text: '恒丰移动金融部',
                    children: [
                        { value: 'WITHDRAW', text: '提现' }, { value: 'ADD', text: '手工调增' }, { value: 'LESSEN', text: '手工调减' }
                    ]
                }, {
                    value: 'EGTRUSTEE',
                    text: '恒丰托管费',
                    children: [
                        { value: 'DEPOSIT', text: '充值' }, { value: 'ADD', text: '手工调增' }, { value: 'LESSEN', text: '手工调减' }
                    ]
                }, {
                    value: 'IBOXPAY',
                    text: '盒子资金户',
                    children: [
                        { value: 'DEPOSIT', text: '充值' }, { value: 'LOAN', text: '放款' }, { value: 'ADD', text: '手工调增' }, { value: 'LESSEN', text: '手工调减' }
                    ]
                }, {
                    value: 'IBOXREPAYMENT',
                    text: '盒子还款户',
                    children: []
                }, {
                    value: 'IBOXSETTLE',
                    text: '盒子结算户',
                    children: []
                }, {
                    value: 'PROFIT',
                    text: '汇和收益户',
                    children: [
                        { value: 'PROFIT', text: '沉淀利润' }, { value: 'WITHDRAW_SERVICE_FEE', text: '提现手续费' }, { value: 'TRUSTEE_FEE', text: '托管费' }, { value: 'ADD', text: '手工调增' }, { value: 'LESSEN', text: '手工调减' }
                    ]
                }, {
                    value: 'RESERVE',
                    text: '汇和准备金户',
                    children: [
                        { value: 'SUPPLEMENT', text: '补充' }, { value: 'ADD', text: '手工调增' }, { value: 'LESSEN', text: '手工调减' }
                    ]
                }, {
                    value: 'TRUSTEE',
                    text: '汇和托管户',
                    children: [
                        { value: 'DEPOSIT', text: '充值' },
                        { value: 'WITHDRAW', text: '提现' },
                        { value: 'ADD', text: '手工调增' },
                        { value: 'LESSEN', text: '手工调减' },
                        { value: 'LOAN', text: '放款' },
                        { value: 'REPAYMENT', text: '还款' },
                        { value: 'PROFIT', text: '沉淀利润' },
                        { value: 'WITHDRAW_SERVICE_FEE', text: '提现手续费' },
                        { value: 'RESERVE', text: '风险准备金' },
                    ]
                }, ]
            }, {
                //资金账户日志类型
                key: 'ZJZHRZLX',
                value: [
                    { value: 'DEPOSIT', text: '充值' },
                    { value: 'WITHDRAW', text: '提现' },
                    { value: 'ADD', text: '手工调增' },
                    { value: 'LESSEN', text: '手工调减' },
                    { value: 'LOAN', text: '放款' },
                    { value: 'REPAYMENT', text: '还款' },
                    { value: 'PROFIT', text: '沉淀利润' },
                    { value: 'SUPPLEMENT', text: '补充' },
                    { value: 'WITHDRAW_SERVICE_FEE', text: '提现手续费' },
                    { value: 'RESERVE', text: '风险准备金' },
                    { value: 'TRUSTEE_FEE', text: '托管费' },
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
                //TODO正式上线时需要修改，现在是测试数据
                key: 'ZCLY', //注册来源
                value: [
                    { value: '1', text: '钱盒商户通1' },
                    { value: '2', text: '钱盒商户通2' },
                    { value: '3', text: '钱盒商户通3' },
                    { value: '4', text: '钱盒商户通4' },
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
                // 提现列表,提现回退
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
            }, {
                key: 'CKZT', //出款状态
                value: [
                    { value: 'P', text: '待出款' },
                    { value: 'E', text: '出款完成' },
                    { value: 'C', text: '出款确认' }
                ]
            }, {
                key: 'ZCZT', //资产状态
                value: [
                    { value: '-1', text: '草稿' },
                    { value: '0', text: '待审核' },
                    { value: '1', text: '审核通过' },
                    { value: '2', text: '上架' },
                    { value: '3', text: '审核不通过' },
                    { value: '4', text: '冻结' },
                    { value: '5', text: '失效' }
                ]
            }, {
                key: 'XMZT',
                value: [
                    { value: 'NEW', text: '新建' },
                    { value: 'PBR', text: '发布审核拒绝' },
                    { value: 'RPB', text: '待发布' },
                    { value: 'IPB', text: '发布中' },
                    { value: 'BDF', text: '投标完成' },
                    { value: 'BDA', text: '结标审核完成' },
                    { value: 'BDR', text: '结标审核拒绝' },
                    { value: 'IRP', text: '还款中' },
                    { value: 'OVD', text: '逾期' },
                    { value: 'NCL', text: '正常关闭' },
                    { value: 'ECL', text: '异常关闭' }
                ]
            }, {
                key: 'CPLX', //产品类型(汇赚钱)
                value: [
                    { value: '0101', text: '汇赚钱理财' },
                    { value: '0901', text: '房贷' },
                    { value: '0801', text: '车贷' }
                ]
            }, {
                key: 'XMLX', //项目类型
                value: [
                    { value: 'NOR', text: '普通推荐' }
                ]
            }, {
                key: 'HTMB', //合同模板
                value: [
                    { value: '1', text: '合同模板' }
                ]
            },
            //    financial
            //        monitor
            {
                key: 'TXQD', //提现渠道
                value: [
                    { value: 'EGBANK', text: '恒丰银行' },
                    { value: 'IBOXPAY', text: '盒子支付' },
                ]
            }, {
                key: 'FSZT', //发送状态
                value: [
                    { value: 'W', text: '等待发送' },
                    { value: 'F', text: '发送失败' },
                    { value: 'S', text: '发送成功' }
                ]
            }, {
                key: 'HZZT', //发送状态
                value: [
                    { value: 'W', text: '等待回执' },
                    { value: 'P', text: '部分回执失败' },
                    { value: 'S', text: '回执成功' },
                    { value: 'F', text: '回执失败' }
                ]
            }, {
                key: 'CKLX', //出款类型
                value: [
                    { value: 'PRJ', text: '项目出款' },
                    { value: 'WDR', text: '提现出款' }
                ]
            }, {
                key: 'DYZT', //打印状态
                value: [
                    { value: 'N', text: '已打印' },
                    { value: 'P', text: '未打印' }
                ]
            }, {
                key: 'HZLX', //划账类型
                value: [
                    { value: '2T1', text: '托管户=>盒子支付' },
                    { value: '3T6', text: '准备金=>恒丰银行' },
                    { value: '2T3', text: '托管户=>准备金' },
                    { value: '2T4', text: '托管户=>收益户' },
                    { value: '4T7', text: '收益户=>结算户打款' },
                    { value: '2T7E', text: '托管户=>恒丰结算户' },
                    { value: '2T7I', text: '托管户=>盒子结算户' },
                    { value: '8T2', text: '盒子还款户=>托管户' }
                ]
            }, {
                key: 'XSPTZT', //销售平台状态
                value: [
                    { value: 0, text: '默认' },
                    { value: 1, text: '正常' },
                    { value: 2, text: '删除' },
                    { value: 3, text: '冻结' },
                    { value: 4, text: '待上线' }
                ]
            }
        ];

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
        var cities = [];


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
                        url: config.METADATA_CONSOLE + '/metadata/' + code,
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
            getCities: function(callback) {
                if (cities && cities.length > 0) {
                    if (typeof callback == 'function')
                        callback(cities);
                    return false;
                }
                $http({
                        url: 'script/data/city.json',
                        method: 'GET',
                        withCredentials: false
                    })
                    .success(function(res) {
                        if (typeof callback == 'function')
                            callback(res);
                    })
                    .error(function(err, msg) {
                        console.log('request error !' + err);
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
