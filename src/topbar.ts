import {
    Dialog, Menu,
    //  fetchSyncPost,
    //  openTab
} from "siyuan";
import { insert, insertButton, insertDocButton, insertNotebookButton } from "./creater/createIndex";
import { i18n, isMobile, plugin } from "./utils";
import SettingsTab from "./components/setting.svelte"
import { settings } from "./settings";
import { onCreateTemplateButton, onGetTemplate } from "./creater/createtemplate";

// //tab类型
// const TAB_TYPE = "custom_tab";

export async function initTopbar() {

    //添加顶栏按钮
    const topBarElement = plugin.addTopBar({
        icon: "iconList",
        title: i18n.addTopBarIcon,
        position: "right",
        callback: async () => {
            insert();
        }
    });

    //添加快捷键
    plugin.addCommand({
        langKey: "addTopBarIcon",
        hotkey: "⌥⌘I",
        callback: async () => {
            insert();
        }
    });

    plugin.addCommand({
        langKey: "insertSubIndexoutline",
        hotkey: "⌥⌘O",
        callback: async () => {
            insertButton();
        }
    });

    plugin.addCommand({
        langKey: "insertoutline",
        hotkey: "⌥⌘P",
        callback: async () => {
            insertDocButton();
        }
    });

    plugin.addCommand({
        langKey: "insertNotebookIndex",
        hotkey: "⌥⌘N",
        callback: async () => {
            insertNotebookButton();
        }
    });

    // //设置右键监听
    // topBarElement.addEventListener("contextmenu", async () => {
    //     await createDialog();
    // });
    //设置右键监听
    topBarElement.addEventListener("contextmenu", async () => {
        if (isMobile) {
            addMenu();
        } else {
            let rect = topBarElement.getBoundingClientRect();
            // 如果被隐藏，则使用更多按钮
            if (rect.width === 0) {
                rect = document.querySelector("#barMore").getBoundingClientRect();
            }
            if (rect.width === 0) {
                rect = document.querySelector("#barPlugins").getBoundingClientRect();
            }
            addMenu(rect);
        }
    });

    // //载入配置
    // await settings.load();

    // //创建一个div节点，将设置界面的svelte导入其中
    // let settingsTab: SettingsTab;
    // let div: HTMLDivElement = document.createElement('div');
    // settingsTab = new SettingsTab({
    //     target: div,
    // });

    // // openTab方法的fn参数
    // let customTab = plugin.addTab({
    //     type: TAB_TYPE,
    //     async init() {
    //         this.element.appendChild(div);
    //     },
    //     destroy() {
    //     }
    // });

    // topBarElement.addEventListener("contextmenu", () => {
    //     addMenu(topBarElement.getBoundingClientRect());
    // });

    // //设置右键监听
    // topBarElement.addEventListener("contextmenu", async () => {
    //     openTab({
    //         app:plugin.app,
    //         custom: {
    //             icon: "iconSettings",
    //             title: i18n.settingsTab.name,
    //             // data: {
    //             //     text: "This is my custom tab",
    //             // },
    //             fn: customTab
    //         },
    //     })
    // });

}

export async function createDialog() {
    //载入配置
    await settings.load();
    await onGetTemplate();

    const settingsDialog = "index-settings"

    const dialog = new Dialog({
        title: i18n.settingsTab.name,
        content: `<div id="${settingsDialog}" class="fn__flex-1 fn__flex config__panel">`,
        width: "70%",
        height: "70%",
    });

    let div: HTMLDivElement = dialog.element.querySelector(`#${settingsDialog}`);

    new SettingsTab({
        target: div,
        props: {
            // onSubOutlineButton: () => { insertButton(dialog) },
            // onDocOutlineButton: () => { insertDocButton(dialog) },
            onCreateTemplateButton: () => onCreateTemplateButton(),
            onGetIndexTemplate: () => onGetTemplate()
        }
    });
}

function addMenu(rect?: DOMRect) {
    const menu = new Menu();
    menu.addItem({
        icon: "iconList",
        label: i18n.insertIndex,
        accelerator: plugin.commands[0].customHotkey,
        click: () => {
            insert();
        }
    });
    menu.addItem({
        icon: "iconAlignLeft",
        label: i18n.insertSubIndexoutline,
        accelerator: plugin.commands[1].customHotkey,
        click: () => {
            insertButton();
        }
    });
    menu.addItem({
        icon: "iconAlignCenter",
        label: i18n.insertoutline,
        accelerator: plugin.commands[2].customHotkey,
        click: () => {
            insertDocButton();
        }
    });
    menu.addItem({
        icon: "iconFilesRoot",
        label: i18n.insertNotebookIndex,
        accelerator: plugin.commands[3].customHotkey,
        click: () => {
            insertNotebookButton();
        }
    });
    menu.addSeparator();
    menu.addItem({
        icon: "iconSettings",
        label: i18n.settings,
        // accelerator: this.commands[0].customHotkey,
        click: async () => {
            await createDialog();
        }
    });
    if (isMobile) {
        menu.fullscreen();
    } else {
        menu.open({
            x: rect.right,
            y: rect.bottom,
            isLeft: true,
        });
    }
}

// export function initObserver() {
//     let config = {
//         attributes: true,
//         childList: true,
//         subtree: true
//     }

//     let callback = function (mutationRecords: MutationRecord[]) {
//         mutationRecords.forEach(function (value, index, array) {
//             // console.log(value);
//             if (value.type == "attributes") {
//                 // console.log("yes");
//                 if(value.attributeName == "data-node-id") {
//                     // console.log(value.attributeName);
//                     console.log(value);
//                 }
//             }
//         });
//     }

//     let observer = new MutationObserver(callback);

//     let target: any;

//     if (isMobile)
//         target = document.querySelector('#editor .protyle-content .protyle-background');
//     else
//         target =  document.querySelector('.layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background');

//     console.log(target);
//     observer.observe(document.querySelector('.layout__center.fn__flex.fn__flex-1'), config);
// }