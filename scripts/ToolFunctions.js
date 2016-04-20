/**
 * Created by yzhang on 16/3/30.
 * file ToolFunctions.js
 * 工具函数类
 */

function showContent(pageName) {
    var pages = ["right_main", "right_doc", "right_photo", "right_msg"];
    for (var i = 0; i < pages.length; i++) {
        if (pages[i] === pageName) {
            $("#" + pages[i]).slideDown(200);
        } else {
            $("#" + pages[i]).slideUp(200);
        }
    }
}
