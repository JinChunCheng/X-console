﻿define(['cookie'], function() {
    var ticket = "rememberMe";
    var userInfo = "loginedUserInfo";
    var session = {
        setTicket: function(ticketObj) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 60 * 60 * 1000);
            document.cookie = ticket + "=" + escape(ticketObj) + ";expires=" + exp.toGMTString();
        },
        getTicket: function() {
            var arr, reg = new RegExp("(^| )" + ticket + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
        deleteTicket: function() {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.getTicket();
            if (cval != null)
                document.cookie = ticket + "=" + cval + ";expires=" + exp.toGMTString();
        },
        checkIsLogged: function() {
            if (this.getTicket() == null) {
                return false;
            }
            return true;
        },
        refreshTicket: function() {
            var ticketValue = this.getTicket();
            if (ticketValue == null) {
                return false;
            }
            this.setTicket(ticketValue);
        },
        rememberLoginUser: function(userObj) {
            $.cookie(userInfo, angular.toJson(userObj));
        },
        getLoginUserInfo: function() {
            var user = $.cookie(userInfo);
            if (user != null && user != "") {
                return eval('(' + user + ')');
            } else {
                return null;
            }
        },
        logout: function() {
            //清ticket
            this.deleteTicket();
            ////清userInfo
            //$.removeCookie(userInfo);
        },
        setCookie: function(key, value) {
            $.cookie(key, value);
        },
        getCookie: function(key) {
            return $.cookie(key);
        }
    };
    return session;
});
