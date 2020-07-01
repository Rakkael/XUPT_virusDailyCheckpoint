// by Rakkael 

function isOnHomePage() {
    // 判断是否在首页
    return textStartsWith("微信").exists() && text("通讯录").exists() && text("发现").exists() && text("我").exists();
}

function goToWeChat() {
    // 打开微信
    toastLog("尝试打开微信");
    app.startActivity({
        action: "View",
        packageName: "com.tencent.mm",
        className: "com.tencent.mm.ui.LauncherUI",
    });
    sleep(3000);
    log(currentPackage());
    if (currentPackage() != "com.tencent.mm") {
        goToWeChat();
        sleep(2000);
    } else {
        toastLog("微信打开成功！");
        goToHomePage();
    }
    sleep(2000);
}

function goToHomePage() {
    // 去微信首页
    var count = 0;
    while (!isOnHomePage() && count < 5) {
        toastLog("后退" + (count + 1) + "步");
        back();
        count += 1;
        sleep(1000);
    }
    sleep(500);
    id("cns").className("android.widget.TextView").text('微信').findOne().parent().parent().click();
    sleep(2000);
    toastLog("已进入微信首页");
}

function goToCheckIn() {
    // 寻找并打开我在校园小程序

    var height = device.height;
    var width = device.width;
    swipe(device.width / 1.2, 300, device.width / 1.2, 1500, 100);

    if (text("我在校园").exists()) {
        toastLog("进入我在校园");
        id("gam").text("我在校园").findOne().parent().click();
        sleep(6000);
    } else {
        toastLog("开始寻找我在校园");

        log('设备宽' + width + '\n' + '设备高' + height);
        while (!id("gam").text("我在校园").exists()) {
            swipe(device.width / 1.2, 300, device.width / 1.2, 1500, 100);
            sleep(100);
        }
        goToCheckIn();
    }
}

function login() {
    // 如果没有登录，则登录
    var me = text("签到").findOne();
    click(me.bounds().centerX(), me.bounds().centerY());
    sleep(1000);
    toastLog("找好的");
    var ok = text("好的").findOne(1000);
    if (ok != null) {
        ok.click();
        sleep(3000);
        className("android.widget.Button").text("登录/注册").findOne().click();
        sleep(500);
        className("android.widget.Button").text("允许").findOne().click();
        toasttoastLog("登录成功！");

    } else {
        toastLog("找不到'好的'");
    }

}

function dailyCheckIn() {
    // 已进入我在校园小程序, 开始打卡
    var height = device.height;
    var width = device.width;
    if (id('dl').text("我在校园").exists() && text("每日健康情况登记").exists()) {

        // 向上滑动，确保在顶部
        scrollUp();
        sleep(500);
        // 点击身体健康
        //  为对号字符

        if (!text("").exists()) {
            toastLog("点击身体健康");
            var iAmHealth = text("无下列情况,身体健康").findOne();
            click(iAmHealth.bounds().centerX() + device.width / 2, iAmHealth.bounds().centerY());
            sleep(1500);
        } else {
            toastLog("已点击身体健康");
        }
        // 点击低风险地区
        toastLog("点击低风险地区");
        var lowRisk = text("低风险地区").findOne();
        click(lowRisk.bounds().centerX(), lowRisk.bounds().centerY());
        sleep(1500);
        scrollDown();
        sleep(500);
        // 点击定位
        toastLog("点击获取位置");
        var location = text("点击获取位置").findOne();
        click(location.bounds().centerX(), location.bounds().centerY());
        sleep(2000);
        // 如果需要授权，则授权定位
        if (className("android.widget.Button").id("f0b").text("允许").exists()) {
            className("android.widget.Button").id("f0b").text("允许").findOne(1000).click();
        }
        // 未打开GPS，请求打开GPS
        if (text("定位超时").exists()) {
            id("doz").text("确定").findOne().click();
            dialogs.alert("请打开GPS后再次执行脚本");
            app.startActivity({
                action: "View",
                packageName: "com.android.settings",
                className: "com.android.settings.Settings",
            });
        }
        // 提交结果
        toastLog("提交");
        dialogs.alert("目前为测试版", "暂时未开放自动提交，请检查后手动提交");

    } else if (id('dl').text("我在校园").exists()) {
        var checkIn = className("android.view.View").text("健康打卡").findOne(1000);
        if (checkIn != null) {
            toastLog('进入健康打卡');
            click(checkIn.bounds().centerX(), checkIn.bounds().centerY());
            sleep(1500);
            dailyCheckIn();
        }
    }
}

function main() {
    dialogs.alert("目前为测试版", "遇到Bug请按'音量+'键结束脚本\n请授权无障碍服务");
    auto.waitFor();
    // console.show();
    goToWeChat();
    goToCheckIn();
    if (text("未登录").exists()) {
        login();
    }
    dailyCheckIn();
    toastLog("done");
}

main();