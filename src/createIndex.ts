import { fetchSyncPost } from 'siyuan';

export async function main(errorMsg_empty: string, errorMsg_miss: string) {
    let parentId = getDocid();
    if (parentId == null) {
        await fetchSyncPost(
            "/api/notification/pushErrMsg",
            {
                msg: errorMsg_empty,
                timeout: 2000
            }
        );
        return;
    }
    let [box, path] = await getParentDoc(parentId);
    let data = '';
    data = await createIndex(box, path, data);
    if (data != '')
        insertData(parentId, data);
    else
        await fetchSyncPost(
            "/api/notification/pushErrMsg",
            {
                msg: errorMsg_miss,
                timeout: 2000
            }
        );
}

//获取当前文档信息
async function getParentDoc(parentId: string) {
    
    let response = await fetchSyncPost(
        "/api/query/sql",
        {
            stmt: `SELECT * FROM blocks WHERE id = '${parentId}'`
        }
    );
    let result = response.data;
    //返回值为数组
    let box = result[0].box;
    let path = result[0].path;
    return [box, path];
}

//获取当前文档id
function getDocid() {
    return document.querySelector('.layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background')?.getAttribute("data-node-id");
}

async function requestSubdoc(notebook: any, path: any) {
    let response = await fetchSyncPost(
        "/api/filetree/listDocsByPath",
        {
            notebook: notebook,
            path: path
        }
    );
    let result = response.data;
    if (result == null) return [];
    return result.files;
}

function getSubdocIcon(icon: string, hasChild: boolean) {
    console.log(icon);
    if (icon == '' || icon == undefined) {
        return hasChild ? "📑" : "📄";
    } else if (icon.indexOf(".") != -1) {
        if (icon.indexOf("http://") != -1 || icon.indexOf("https://") != -1) {
            return hasChild ? "📑" : "📄";
        } else {
            // 移除扩展名
            let removeFileFormat = icon.substring(0, icon.lastIndexOf("."));
            return `:${removeFileFormat}:`;
        }
    } else {
        return String.fromCodePoint(parseInt(icon, 16));
    }
}

//创建目录
async function createIndex(notebook: any, ppath: any, data: string, tab = 0) {

    let docs = await requestSubdoc(notebook, ppath);
    tab++;
    //生成写入文本
    for (let doc of docs) {

        let id = doc.id;
        let name = doc.name.slice(0, -3);
        let icon = doc.icon;
        let subFileCount = doc.subFileCount;
        let path = doc.path;
        for (let n = 0; n < tab; n++)
            data += '  ';
        data += `* ${getSubdocIcon(icon, subFileCount != 0)}[${name}](siyuan://blocks/${id})\n`;

        if (subFileCount > 0) {//获取下一层级子文档
            data = await createIndex(notebook, path, data, tab);
        }

    }
    return data;
}

async function insertData(id: string, data: string) {
    await fetchSyncPost(
        "/api/block/prependBlock",
        {
            data: data,
            dataType: "markdown",
            parentID: id
          }
    );
}