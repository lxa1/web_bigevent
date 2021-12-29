$(function () {
    // 调用获取用户信息的函数
    getUserInfo();

    //绑定点击退出按钮事件
    var layer = layui.layer;
    $('#loginOut').on('click', function (e) {
        e.preventDefault();
        layer.confirm('确定退出登录？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            localStorage.removeItem('token');
            location.href = './login.html';

            layer.close(index);
        });
    })





})
//获取用户信息的函数
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if (res.code !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            //调用渲染用户头像函数
            renderAvatar(res.data);
        },

    })
}

//渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;' + name);

    // 渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}

function btnPubClick() {
    $('#art_pub').click();
}