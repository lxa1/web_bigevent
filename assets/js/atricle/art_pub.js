$(function () {
    layer = layui.layer;
    form = layui.form;

    initCate();
    //初始化富文本编辑器
    initEditor();

    // 获取下拉列表框的文章分类信息
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('.layui-card-body select').append(htmlStr);

                //一定要记得调用render方法,重新渲染一下表单
                form.render();
            }
        })
    }




    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //为选择封面的按钮绑定事件处理函数
    $('#btnChooseImage').on('click', function (e) {
        $('#coverFile').click();
    })


    //监听coverFile的change事件，获取用户选择的文件
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = "已发布";
    $('#btnSave1').on('click', function () {
        art_state = "草稿";
    })
    //为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //快速创建一个formData对象
        var fd = new FormData($(this)[0]);
        //将文章的状态加入到fd当中
        fd.append('state', art_state);


        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })


    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('发布失败')
                }
                layer.msg('发布成功');
                location.href = "/article/art_list.html";
                
            }
        })
    }
})