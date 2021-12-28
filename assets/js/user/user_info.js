$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间';
            }
        }
    })

    // 调用初始化用户的基本信息函数
    initUserInfo();






    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败');
                }
                form.val('userInfo', res.data);
            }
        })
    }

    //点击重置按钮
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        //再次初始化用户信息
        initUserInfo();
    })

    //点击提交修改按钮
    $('#user_info').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: {
                id: $('#user_info [name=id]').val(),
                nickname: $('#user_info [name=nickname]').val(),
                email: $('#user_info [name=email]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功');
                //调用父页面中的方法，重新渲染用户的头像和用户名
                // 父页面的这个函数不能放在$(function(){})里面
                window.parent.getUserInfo();
            }
        })
    })
})