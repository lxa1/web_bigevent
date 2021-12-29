$(function () {

    // 点击去注册的链接
    $('#link_reg').on('click', function (e) {
        $('.login-box').hide().siblings('.reg-box').show();
    })

    //点击去登陆的链接
    $('#link_login').on('click', function (e) {
        $('.reg-box').hide().siblings('.login-box').show();
    })
    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;

    //自定义密码psd规则
    form.verify({
        psd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        repsd: function (value) {
            if (value !== $('.reg-box [name=password]').val()) {
                return '两次密码不一致';
            }
        }
    })


    //监听表单注册提交事件
    $('#form_reg').on('submit', function (e) {
        // 禁止表单默认事件
        e.preventDefault();
        //向服务器发送post请求
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: { username: $('.reg-box [name=username]').val(), password: $('.reg-box [name=password]').val() },
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    //layui.layer的内置提醒框
                    layer.msg(res.message);
                } else {
                    layer.msg('注册成功');
                    // 跳到登陆页面
                    $('#link_login').click();
                    
                }
            }
        })
    })

    //监听登录表单提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        // 发起post请求
        $.ajax({
            type: 'POST',
            url: '/api/login',
            //获取表单所有数据
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('账号或者密码错误')
                }
                layer.msg('登陆成功');
                //将服务器返回的token保存到localStorage当中
                localStorage.setItem('token', res.token);
                //跳转到主页
                location.href = './index.html';
            }
        })
    })
})