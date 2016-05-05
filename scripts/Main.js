/**
 * Created by yzhang on 16/3/18.
 */

$(function() {
    AV.initialize('GFiHjvYhirVppkxF8O2C52wN-gzGzoHsz', 'tSIwGVHY3RCcECIUEmvN2Oq5');
    Init();
});

var IMGLIST = AV.Object.extend("imgList");
var DOCLIST = AV.Object.extend("docList");
var MSGLIST = AV.Object.extend("msgList");

function Init() {
    $("#right_main").show();
    InitBtns();
    InitMask();
    InitRightMenu();
    refreshMainPage();
    refreshDocs();
    refreshPhotos();
    refreshMsgs();

    document.onclick = function() {
        $("#right_menu").slideUp(200);
    };
}

function InitBtns() {
    $("#upload").click(function() {
        var fileUploadControl = $("#uploadFile")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = file.name;
            var avFile = new AV.File(name, file);
            avFile.save().then(function(obj) {
                IMGLIST.new({
                    imgUrl: obj.url(),
                    imgThumbUrl: obj.thumbnailURL(149, 85),
                    imgName: name,
                    imgId: obj.id
                }).save().then(function(obj) {
                    swal({
                        title: '成功!',
                        text: '你的文件已保存到云端',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    refreshPhotos();
                }, function(err) {
                    swal({
                        title: "错误!",
                        text: "上传文件失败!错误代码: " + err.code,
                        type: "error"
                    });
                    console.log(err);
                });
            }, function(err) {
                swal({
                    title: "错误!",
                    text: "上传文件失败!错误代码: " + err.code,
                    type: "error"
                });
                console.log(err);
            });
        } else {
            swal({
                title: "请选择要上传的文件!",
                timer: 1000,
                type: 'info',
                showConfirmButton: false
            });
        }
    });
    $("#newdoc").click(function() {
        swal({
            title: "新建文档",
            text: "请输入文件名:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            inputPlaceholder: "新建文档"
        }, function(inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("请输入有效的文件名!");
                return false
            }
            $("#filename").text(inputValue);
            $("#text").html("");
            $("#mask").data("id", 0).slideDown(200);
            swal({
                title: '成功!',
                text: "文件\"" + inputValue + "\"创建成功!",
                type: 'success',
                showConfirmButton: false,
                timer: 1000
            });
        });
    });
    $("#refresh").click(function() {
        refreshDocs();
        refreshPhotos();
        refreshMsgs();
    });
    $("#btn_head").click(function() {
        showContent("right_main");
        return false;
    });
    $('#btn_doc').on({
        click: function() {
            showContent("right_doc");
            return false;
        },
        mouseenter: function() {
            $(this).children(".tip").slideDown(200);
        },
        mouseleave: function() {
            $(this).children(".tip").slideUp(200);
        }
    });
    $('#btn_photo').on({
        click: function() {
            showContent("right_photo");
            return false;
        },
        mouseenter: function() {
            $(this).children(".tip").slideDown(200);
        },
        mouseleave: function() {
            $(this).children(".tip").slideUp(200);
        }
    });
    $('#btn_msg').on({
        click: function() {
            showContent("right_msg");
            return false;
        },
        mouseenter: function() {
            $(this).children(".tip").slideDown(200);
        },
        mouseleave: function() {
            $(this).children(".tip").slideUp(200);
        }
    });

    $('.message-input').submit(function () {
        var input = $(".message-input :text");
        var msg = input.val();
        if (msg == ''){
            swal({
                title: "请输入信息内容!",
                timer: 1000,
                type: 'info',
                showConfirmButton: false
            });
            return false;
        }
        MSGLIST.new({
            msg: msg
        }).save().then(function () {
            input.val('');
            refreshMsgs();
        }, function (err) {
            swal({
                title: "错误!",
                text: "信息发送失败!错误代码" + err.code,
                type: "error"
            });
            console.log(err);
        });
        return false;
    });
}

function InitMask() {
    $("#toolbar-btn .style-control").click(function() {
        switch ($(this).data('role')) {
            case 'h1':
            case 'h2':
            case 'p':
                document.execCommand('formatBlock', false, '<' + $(this).data('role') + '>');
                break;
            default:
                document.execCommand($(this).data('role'), false, null);
                break;
        }
        return false;
    });
    $("#close").click(function() {
        $("#mask").slideUp(200);
    });
    $("#save").click(function() {
        var mask = $("#mask");
        var thisId = mask.data("id");
        if (thisId == 0) {
            DOCLIST.new({
                docName: $("#filename").text(),
                docContent: $("#text").html()
            }).save().then(function() {
                swal({
                    title: '成功!',
                    text: '你的文档已保存到云端',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 1000
                });
                refreshDocs();
                mask.slideUp(200);
            }, function(err) {
                swal({
                    title: "错误!",
                    text: "保存文档失败!错误代码: " + err.code,
                    type: "error"
                });
                console.log(err);
            });
        } else {
            var query = new AV.Query(DOCLIST);
            query.get(thisId).then(function(obj) {
                obj.set('docContent', $("#text").html()).save().then(function() {
                    swal({
                        title: '成功!',
                        text: '修改已保存到云端',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    refreshDocs();
                    mask.slideUp(200);
                }, function(err) {
                    swal({
                        title: "错误!",
                        text: "保存文档失败!错误代码: " + err.code,
                        type: "error"
                    });
                    console.log(err);
                });
            }, function(err) {
                swal({
                    title: "错误!",
                    text: "获取文档失败!错误代码: " + err.code,
                    type: "error"
                });
                console.log(err);
            });
        }
    });
}

function InitRightMenu() {
    $("#right_menu li").on({
        mouseenter: function() {
            $(this).addClass("active");
        },
        mouseleave: function() {
            $(this).removeClass("active");
        }
    });
    $("#delete").on("click", function() {
        var menu = $("#right_menu");
        var id = menu.data("id");
        var type = menu.data("type");
        menu.slideUp(200);
        swal({
                title: "确认要删除?",
                text: "该操作无法撤销!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                showLoaderOnConfirm: true,
                closeOnConfirm: false
            },
            function() {
                if (type == 'doc') {
                    var query = new AV.Query(DOCLIST);
                    query.get(id).then(function(obj) {
                        obj.destroy().then(function() {
                            swal({
                                title: '成功!',
                                text: '文件已删除',
                                type: 'success',
                                showConfirmButton: false,
                                timer: 1000
                            });
                            refreshDocs();
                        }, function(err) {
                            swal({
                                title: "错误!",
                                text: "删除文档失败!错误代码: " + err.code,
                                type: "error"
                            });
                            console.log(err);
                        });
                    }, function(err) {
                        swal({
                            title: "错误!",
                            text: "获取文档失败!错误代码: " + err.code,
                            type: "error"
                        });
                        console.log(err);
                    });
                } else if (type == 'img') {
                    var query = new AV.Query(IMGLIST);
                    query.get(id).then(function(obj) {
                        obj.destroy().then(function() {
                            swal({
                                title: '成功!',
                                text: '文件已删除',
                                type: 'success',
                                showConfirmButton: false,
                                timer: 1000
                            });
                            refreshPhotos();
                        }, function(err) {
                            swal({
                                title: "错误!",
                                text: "删除相片失败!错误代码: " + err.code,
                                type: "error"
                            });
                            console.log(err);
                        });
                    }, function(err) {
                        swal({
                            title: "错误!",
                            text: "获取相片失败!错误代码: " + err.code,
                            type: "error"
                        });
                        console.log(err);
                    })
                } else if(type == 'msg'){
                    var query = new AV.Query(MSGLIST);
                    query.get(id).then(function (obj) {
                        obj.destroy().then(function () {
                            swal({
                                title: '成功!',
                                text: '信息已删除',
                                type: 'success',
                                showConfirmButton: false,
                                timer: 1000
                            });
                            refreshMsgs();
                        }, function (err) {
                            swal({
                                title: "错误!",
                                text: "删除信息失败!错误代码: " + err.code,
                                type: "error"
                            });
                            console.log(err);
                        });
                    }, function (err) {
                        swal({
                            title: "错误!",
                            text: "获取信息失败!错误代码: " + err.code,
                            type: "error"
                        });
                        console.log(err);
                    });
                }
            });
        return false;
    });
    $("#rename").on('click', function() {
        var menu = $("#right_menu");
        var id = menu.data("id");
        var type = menu.data("type");
        menu.slideUp(200);
        if(type == 'msg'){
            var query = new AV.Query(MSGLIST);
            query.get(id).then(function (obj) {
                obj.set('msg', obj.get('msg')).save().then(function () {
                    swal({
                        title: '成功!',
                        text: '信息已重新发送',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 1000
                    });
                    refreshMsgs();
                }, function (err) {
                    swal({
                        title: "错误!",
                        text: "重新发送失败!错误代码: " + err.code,
                        type: "error"
                    });
                    console.log(err);
                });
            }, function (err) {
                swal({
                    title: "错误!",
                    text: "获取信息失败!错误代码: " + err.code,
                    type: "error"
                });
                console.log(err);
            });
            return false;
        }
        swal({
                title: "重命名",
                text: "请输入新的文件名:",
                type: "input",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                inputPlaceholder: "重命名"
            },
            function(inputValue) {
                if (inputValue === false) return false;
                if (inputValue === "") {
                    swal.showInputError("请输入有效的文件名!");
                    return false
                }
                if (type == 'doc') {
                    var query = new AV.Query(DOCLIST);
                    query.get(id).then(function(obj) {
                        obj.set('docName', inputValue)
                            .save().then(function() {
                                swal({
                                    title: '成功!',
                                    text: '文件名已修改',
                                    type: 'success',
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                                refreshDocs();
                            }, function(err) {
                                swal({
                                    title: "错误!",
                                    text: "修改文件名失败!错误代码: " + err.code,
                                    type: "error"
                                });
                                console.log(err);
                            });
                    }, function(err) {
                        swal({
                            title: "错误!",
                            text: "获取文档失败!错误代码: " + err.code,
                            type: "error"
                        });
                        console.log(err);
                    });
                } else if (type == 'img') {
                    var query = new AV.Query(IMGLIST);
                    // console.log(id);
                    query.get(id).then(function(obj) {
                        // swal({title: obj.get('imgName'), timer: 1000});
                        // return false;
                        obj.set('imgName', inputValue)
                            .save().then(function() {
                                swal({
                                    title: '成功!',
                                    text: '文件名已修改',
                                    type: 'success',
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                                refreshPhotos();
                            }, function(err) {
                                swal({
                                    title: "错误!",
                                    text: "修改文件名失败!错误代码: " + err.code,
                                    type: "error"
                                });
                                console.log(err);
                            });
                    }, function(err) {
                        swal({
                            title: "错误!",
                            text: "获取相片失败!错误代码: " + err.code,
                            type: "error"
                        });
                        console.log(err);
                    });
                }
            });
        return false;
    });
}

function refreshMainPage() {}

function refreshDocs() {
    var query = new AV.Query('docList');
    var rightDoc = $("#right_doc");
    rightDoc.empty();
    query.find().then(function(results) {
        for (var i = 0; i < results.length; i++) {
            var obj = results[i];
            var a = $("<a href='#'></a>");
            var pin = $("<div class='pin'></div>").appendTo(a);
            var box = $("<div class='box'></div>").appendTo(pin);
            $("<img src='images/docs.png'/>").appendTo(box);
            $("<p></p>").text(obj.get("docName")).appendTo(pin);

            a.data("id", obj.id).on({
                "click": function() {
                    $("#mask").slideDown(200);
                    var query = new AV.Query(DOCLIST);
                    var docId = $(this).data("id");
                    query.get(docId).then(function(doc) {
                        $("#mask").data("id", docId);
                        $("#filename").text(doc.get("docName"));
                        $("#text").html(doc.get("docContent"));
                    }, function(err) {
                        swal({
                            title: "错误!",
                            text: "获取文档失败!错误代码: " + err.code,
                            type: "error"
                        });
                        console.log(err);
                    });
                },
                "contextmenu": function(event) {
                    $("#rename").text("重命名");
                    event = event || window.event;
                    $("#right_menu").css({
                        position: "fixed",
                        top: event.clientY + "px",
                        left: event.clientX + "px"
                    }).data({
                        'id': $(this).data('id'),
                        'type': 'doc'
                    }).slideDown(200);
                    return false;
                }
            });
            rightDoc.append(a);
        }
    }, function(err) {
        swal({
            title: "错误!",
            text: "获取文档失败!错误代码: " + err.code,
            type: "error"
        });
        console.log(err);
    });
}

function refreshPhotos() {
    var query = new AV.Query('imgList');
    var rightPhoto = $("#right_photo");
    rightPhoto.empty();
    query.find().then(function(results) {
        for (var i = 0; i < results.length; i++) {
            var object = results[i];
            var url = object.get("imgUrl");
            var thumbUrl = object.get("imgThumbUrl");
            var name = object.get("imgName");
            var id = object.id;
            var a = $("<a href=" + url + " data-rel='lightcase' title='" + name + "'></a>");
            var pin = $("<div class='pin'></div>").appendTo(a);
            var box = $("<div class='box'></div>").appendTo(pin);
            $("<img src=" + thumbUrl + "/>").appendTo(box);
            $("<p></p>").text(name).appendTo(pin);
            a.data("id", id).on("contextmenu", function(event) {
                $("#rename").text("重命名");
                event = event || window.event;
                $("#right_menu").css({
                    position: "fixed",
                    top: event.clientY + "px",
                    left: event.clientX + "px"
                }).data({
                    "id": $(this).data("id"),
                    "type": "img"
                }).slideDown(200);
                return false;
            }).lightcase();
            rightPhoto.append(a);
        }
    }, function(err) {
        swal({
            title: "错误!",
            text: "获取相片失败!错误代码: " + err.code,
            type: "error"
        });
        console.log(err);
    });
}

function refreshMsgs() {
    var query = new AV.Query('msgList');
    query.addDescending('updatedAt');
    var msgList = $(".message-list");
    msgList.empty();
    query.find().then(function (results) {
        if(results.length == 0){
            var noMsg = $("<li></li>").appendTo(msgList);
            $("<p></p>").text("/(ㄒoㄒ)/~~没有信息,发送一条试试吧~").appendTo(noMsg);
        }
        for(var i= 0; i< results.length; i++){
            var object = results[i];
            var msg = object.get('msg');
            var time = object.updatedAt;
            var id = object.id;
            var timeString ="(" + (time.getMonth()+1) +"月"+time.getDate()+"日 "+time.getHours()+":"+time.getMinutes()+")";
            var li = $("<li></li>").appendTo(msgList);
            var p = $("<p></p>").text(msg).appendTo(li);
            $("<em></em>").text(timeString).appendTo(p);

            li.data("id",id).on("contextmenu", function(event) {
                $("#rename").text("重新发送");
                event = event || window.event;
                $("#right_menu").css({
                    position: "fixed",
                    top: event.clientY + "px",
                    left: event.clientX + "px"
                }).data({
                    'id': $(this).data('id'),
                    'type': 'msg'
                }).slideDown(200);
                return false;
            });
        }
    }, function (err) {
        swal({
            title: "错误!",
            text: "获取信息失败!错误代码: " + err.code,
            type: "error"
        });
        console.log(err);
    });
}
