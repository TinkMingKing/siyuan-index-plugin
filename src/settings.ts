import { fetchSyncPost } from "siyuan";
import { plugin } from "./utils";

//配置文件名称
export const CONFIG = "config";

//配置文件内容
// export const DEFAULT_CONFIG = {
//     icon: true,
//     depth: 0,
//     listType:"unordered",
//     linkType:"ref",
//     docBuilder: false,
//     autoUpdate: true,
//     col:1,
//     fold:0,
//     at:true,
//     outlineAutoUpdate: false,
//     outlineType:"ref",
//     listTypeOutline:"unordered",
// };

/**
 * 配置类
 */
class Settings{

    //初始化配置文件
    // async initData() {
    //     //载入配置
    //     await this.load();

    //     //配置不存在则按照默认值建立配置文件
    //     if (plugin.data[CONFIG] === "" || plugin.data[CONFIG] === undefined || plugin.data[CONFIG] === null) {
    //         await plugin.saveData(CONFIG, JSON.stringify(DEFAULT_CONFIG));
    //     }
    //     await this.load();
    // }

    async initData() {
        //载入配置
        await this.load();

        //配置不存在则按照默认值建立配置文件
        if (plugin.data[CONFIG] === "" || plugin.data[CONFIG] === undefined || plugin.data[CONFIG] === null) {
            await plugin.saveData(CONFIG, JSON.stringify(new SettingsProperty()));
        }
        await this.load();
    }

    set(key:any, value:any,config = CONFIG){
        plugin.data[config][key] = value;
    }

    get(key:any,config = CONFIG){
        return plugin.data[config]?.[key];
    }

    async load(config = CONFIG){
        await plugin.loadData(config);
    }

    async save(config = CONFIG){
        await plugin.saveData(config, plugin.data[config]);
    }

    async saveCopy(config = CONFIG){
        await plugin.saveData(config, plugin.data[CONFIG]);
    }

    async saveTo(config:string){
        plugin.data[config]["docBuilder"] = plugin.data[CONFIG]["docBuilder"];
        await plugin.saveData(CONFIG, plugin.data[config]);
    }

    async remove(config = CONFIG){
        await plugin.removeData(config);
    }

    async rename(config:string, newname:string){
        await fetchSyncPost(
            "/api/file/renameFile",
            {
                "path": `/data/storage/petal/siyuan-plugins-index/${config}`,
                "newPath": `/data/storage/petal/siyuan-plugins-index/${newname}`
              }
        );
    }

    loadSettings(data: any){
        this.set("icon",data.icon);
        this.set("depth",data.depth);
        this.set("listType",data.listType);
        this.set("linkType",data.linkType);
        this.set("fold",data.fold);
        this.set("col",data.col);
        this.set("autoUpdate",data.autoUpdate);
    }

    loadSettingsforOutline(data: any){
        this.set("at",data.at);
        this.set("outlineType",data.outlineType);
        this.set("outlineAutoUpdate",data.outlineAutoUpdate);
        this.set("listTypeOutline",data.listTypeOutline);
    }

}

export const settings: Settings = new Settings();

export class SettingsProperty {
    icon: boolean;
    depth: number;
    listType: string;
    linkType: string;
    docBuilder: boolean;
    autoUpdate: boolean;
    col: number;
    fold: number;
    at: boolean;
    outlineAutoUpdate: boolean;
    outlineType: string;
    listTypeOutline: string;

    constructor(){
        this.icon = true;
        this.depth = 0;
        this.listType = "unordered";
        this.linkType = "ref";
        this.docBuilder = false;
        this.autoUpdate = true;
        this.col = 1;
        this.fold = 0;
        this.at = true;
        this.outlineAutoUpdate = false;
        this.outlineType = "ref";
        this.listTypeOutline = "unordered";
    }

    getAll(){
        this.icon = settings.get("icon");
        this.depth = settings.get("depth");
        this.listType = settings.get("listType");
        this.linkType = settings.get("linkType");
        this.docBuilder = settings.get("docBuilder");
        this.autoUpdate = settings.get("autoUpdate");
        this.col = settings.get("col");
        this.fold = settings.get("fold");
        this.at = settings.get("at");
        this.outlineAutoUpdate = settings.get("outlineAutoUpdate");
        this.outlineType = settings.get("outlineType");
        this.listTypeOutline = settings.get("listTypeOutline");
    }

}