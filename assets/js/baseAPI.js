//在每次调用$.get或者$.post和$.ajax的的时候,都会先调用ajaxPrefilter这个函数,在这个函数当中我们可以拿到ajax传递给服务器的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一为有权限的接口设置请求头
    var reg = /my/;
    if (reg.test(options.url)) {
        options.headers = {
            Authorization: localStorage.getItem('token')||''
        }
    }

    // 不论请求成功或是失败都会调用这个函数
    options.complete=function (res) {
        // 在回调函数中，res.responseJSON里面就是服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem('token');
            location.href="./login.html"
        }
    }
    
})