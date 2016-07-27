/*
    Author: gavin.miao
    Create date: 2016.04.25
    Description: so公共过滤器，支持多个过滤器写在同一文件中（二维数组的形式）
*/
define(['service/config'], function(config) {
    return [
        ['handleVolumn', [function() {
            return function(input,volumnUnit) {
                if(input){
                    if(volumnUnit == 'cm'){
                        if(input >= 1000){
                            return (input/1000000).toFixed(3);
                        }else{
                            return 0.001;
                        }
                    }else{
                        return input.toFixed(3);
                    }
                }else{
                    return 0;
                }
            };
        }]],
        ['handleWeight', [function() {
            return function(input,weightUnit) {
                return input.toFixed(3);
            };
        }]],
        ['handleFinanceConfirmStatus', [function() {
            return function(input,orderStatus,payStatus) {
                switch(input){
                    case 'ACCEPT':
                    case 'REJECT':break;
                    case 'REVIEW':{input = '';break;}
                    case 'DECLINE': {
                        if(orderStatus == 'PENDING APPROVAL' && (payStatus=='WAIT'||payStatus=='failed')){
                            input ='NONE';break;
                        }else if(orderStatus == 'PENDING APPROVAL' && (payStatus=='AUTHORIZING')){
                            input ='REJECT';break;
                        }else{
                            input ='NONE';break;
                        }
                    }
                    default : {input ='NONE';break;}
                }
                return input;
            };
        }]],
        ['handleOrder', [function() {
            return function(input,payStatus) {
                var orderStatus = '';
                if(input){
                    orderStatus = input.toUpperCase();
                }
                switch(orderStatus){
                    case 'PENDING APPROVAL':orderStatus= 'Pending';break;
                    case 'CLOSED':orderStatus= 'Cancelled';break;
                    case 'BILLED':orderStatus= 'Billed';break;
                    case 'PENDING BILLING':orderStatus= 'Shipped';break;
                    case 'COMPLETED':orderStatus= 'Completed';break;
                    case 'CANCELLED':orderStatus= 'Not Accept';break;
                    case 'PENDING FULFILLMENT':orderStatus= 'Accept';break;
                    case 'PARTIALLY FULFILLED':orderStatus= 'Partially Fulfilled';break;
                    default: orderStatus= input;break;
                }

                orderStatus = (orderStatus == 'Pending' &&
                (payStatus=='WAIT'||payStatus=='failed')?'Incomplete Payment':orderStatus );
                return orderStatus;
            };
        }]],
        ['handleOrderMemo', [function() {
            return function(input,payStatus) {
                var orderStatus = '';
                if(input){
                    orderStatus = input.toUpperCase();
                }
                switch(orderStatus){
                    case 'PENDING APPROVAL':orderStatus= 'Pending';break;
                    case 'CLOSED':orderStatus= 'Cancelled';break;
                    case 'BILLED':orderStatus= 'Billed';break;
                    case 'PENDING BILLING':orderStatus= 'Shipped';break;
                    case 'COMPLETED':orderStatus= 'Completed';break;
                    case 'CANCELLED':orderStatus= 'Not Accept';break;
                    case 'PENDING FULFILLMENT':orderStatus= 'Accept';break;
                    case 'PARTIALLY FULFILLED':orderStatus= 'Partially Fulfilled';break;
                    default: orderStatus= input;break;
                }
                return orderStatus == 'Pending' && payStatus=='WAIT'?'(no auth)':(orderStatus == 'Pending'&&payStatus=='failed'?'(auth failed)':'');
            };
        }]]
    ];
});
