import { Plugin } from "siyuan";
import "./index.scss";
import { setI18n, log, setPlugin } from "./utils";
import { initTopbar } from "./topbar";
import { settings } from "./settings";

export default class IndexPlugin extends Plugin {

    async onload() {
        log("IndexPlugin onload");

        this.init();

        await settings.initData();

        initTopbar();
    }

    onunload() {
        log("IndexPlugin onunload");
    }

    init(){
        setI18n(this.i18n);
        setPlugin(this);
    }


}