//在每次调用$.get或者$.post和$.ajax的的时候,都会先调用ajaxPrefilter这个函数,在这个函数当中我们可以拿到ajax传递给服务器的配置对象
$.ajaxPrefilter(function (options) {
    options.url='http://api-breakingnews-web.itheima.net'+options.url
})