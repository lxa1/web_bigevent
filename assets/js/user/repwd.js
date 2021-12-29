$(function () {
    var form = layui.form;
    var layer = layui.layer;
    //自定义密码psd规则
    form.verify({
        psd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('.layui-form [name=old_pwd]').val()) {
                return '与新密码相同';
            }
        },
        repsd: function (value) {
            if (value !== $('.layui-form [name=new_pwd]').val()) {
                return '两次密码不一致';
            }
        }
    })
    // 定义提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        updatePwd();
    })



    //定义请求更新函数
    function updatePwd() {
        $.ajax({
            method: 'PATCH',
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改密码成功');
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    }
})