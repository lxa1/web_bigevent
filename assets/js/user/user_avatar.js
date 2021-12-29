$(function () {
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)



    // 绑定点击上传按钮事件
    $('#btnChooseImage').on('click', function (e) {
        e.preventDefault();
        $('#file').click();
    })


    //file改变事件
    $('#file').on('change', function (e) {
        var first = e.target.files;
        if (first.length == 0) {
            return layer.msg('请选择图片');
        }


        // 拿到用户选择的文件
        var file = e.target.files[0];
        //将文件转化为路径
        var imgURL = URL.createObjectURL(file);

        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    //点击确定按钮，上传头像
    $('#btnUpload').on('click', function (e) {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调用接口，将头像字符串上传到服务器
        $.ajax({
            method: 'PATCH',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('修改头像失败');
                }
                layer.msg('修改头像成功');
                window.parent.getUserInfo();
            }
        })
    })
})