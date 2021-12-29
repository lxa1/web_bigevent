$(function () {
    layer = layui.layer;
    form = layui.form;
    laypage = layui.laypage;
    //定义一个查询参数对象，将来请求数据的时候可以将这个参数对象发送到服务器，包括页码、每页显示几条数据、文章分类的id、文章的发布状态
    var q = {
        pagenum: 1, //页码
        pagesize: 3, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }

    //定义补零函数
    function padZero(n) {
        return n <= 9 ? '0' + n : n
    }
    initTable();
    getArtCate();

    //为筛选表单绑定submit事件
    $('#form-cate').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        initTable();
    })






    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', res);
                $('.layui-table tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }


    //获取分类信息
    function getArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('#form-cate [name=cate_id]').append(htmlStr);

                //一定要记得调用render方法,重新渲染一下表单
                form.render();
            }
        })
    }


    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示多少条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [3, 6, 9],
            // 页面发生切换的时候触发jump回调函数

            // 触发jump回调的方式有两种：
            // 1.点击页码的时候    first=undefined
            // 2.laypage.render()被调用的时候 first=true

            jump: function (obj, first) {
                //obj.curr就是页码值
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }


    // //为删除按钮绑定事件
    $('tbody').on('click', '.art_del', function (e) {
        // 获取当前页面删除按钮的个数
        var len = $('.art_del').length;
        console.log(len);
        var delId = $(this).attr('data-id');
        layer.confirm('确定删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'DELETE',
                url: '/my/article/info?id=' + delId,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });


    })
})