const crypto = require('crypto');

module.exports={
    md5: function(str) {
        var obj = crypto.createHash('md5');
        //更新字符串
        obj.update(str);

        //加密字符串
        return obj.digest('hex');
    },
    MD5_SUFFIX: '2019/7/11yc792819924@163.com',
    SUPER_PASS: '19950824',
    formatDateTime: function (date) {  
        var y = date.getFullYear();  
        var m = date.getMonth() + 1;  
        m = m < 10 ? ('0' + m) : m;  
        var d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        var h = date.getHours();  
        h=h < 10 ? ('0' + h) : h;  
        var minute = date.getMinutes();  
        minute = minute < 10 ? ('0' + minute) : minute;  
        var second=date.getSeconds();  
        second=second < 10 ? ('0' + second) : second;  
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
    }
}
