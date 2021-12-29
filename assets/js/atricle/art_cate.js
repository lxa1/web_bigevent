$(function () {
    form = layui.form;
    layer = layui.layer;
    initAtrCateList();
    // 获取文章分类列表函数
    function initAtrCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                var htmlStr = template('art_cate', res);
                $('.layui-table tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    //为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });
    })


    //为确认添加文章分类绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('新增分类失败')
                }
                initAtrCateList();
                layer.msg('新增分类成功');
                layer.close(indexAdd);
            }
        })
    })

    var indexEdit = null;
    //给修改按钮绑定事件
    $('tbody').on('click', '#btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        });
        var cate_id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/cate/info',
            data: {
                id:cate_id,
            },
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })


    //给修改表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'PUT',
            url: '/my/cate/info',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('修改失败')
                }
                layer.msg('修改成功')
                layer.close(indexEdit);
                initAtrCateList();
            }
        })
    })


    //给删除按钮添加绑定事件
    $('tbody').on('click', '#btnDel', function (e) {
        var cate_id = $(this).attr('data-id');
        layer.confirm('确定删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //发起请求
            $.ajax({
                method: 'DELETE',
                url: '/my/cate/del?id='+cate_id,
                success: function (res) {
                    if (res.code !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    initAtrCateList();
                }
            })

            layer.close(index);
        });
    })
})