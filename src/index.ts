import { Plugin } from "siyuan";
import { setI18n, setPlugin } from "./utils";
import { createDialog, initTopbar } from "./topbar";
import { settings } from "./settings";
import { buildDoc } from "./blockiconevent";
import { updateIndex } from "./protyleevent";

export default class IndexPlugin extends Plugin {

    //加载插件
    async onload() {
        console.log("IndexPlugin onload");
        this.init();
        await initTopbar();
        // await this.initSettings();
        await settings.initData();
        //监听块菜单事件
        this.eventBus.on("click-blockicon", buildDoc);
        //监听文档载入事件
        this.eventBus.on("loaded-protyle-static", updateIndex);
        // this.eventBus.on("ws-main",this.eventBusLog);
        
    }
    // onLayoutReady() {
    //     initObserver();
    // }

    onunload() {
        this.eventBus.off("click-blockicon", buildDoc);
        this.eventBus.off("loaded-protyle-static", updateIndex);
        console.log("IndexPlugin onunload");
    }

    //获取i18n和插件类实例
    init(){
        setI18n(this.i18n);
        setPlugin(this);
        // console.log(this.getOpenedTab());
    }

    //输出事件detail
    // private eventBusLog({detail}: any) {
    //     console.log(detail);
    // }
    async openSetting(){
        await createDialog();
    }

}