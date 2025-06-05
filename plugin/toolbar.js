class toolbarPlugin extends BasePlugin {
    beforeProcess = () => {
        this.toolController = new toolController(this);
        const tools = [tabTool, pluginTool, recentFileTool, operationTool, modeTool, themeTool, outlineTool, functionTool, mixTool];
        tools.forEach(tool => this.toolController.register(new tool()));
    }

    hotkey = () => [{ hotkey: this.config.HOTKEY, callback: this.call }]

    styleTemplate = () => ({ topPercent: parseInt(this.config.TOOLBAR_TOP_PERCENT) + "%" })

    html = () => {
        const title = [...this.toolController.tools.values()]
            .map(t => `${t.name()}：${t.translate()}`)
            .join("\n")
        return `
            <div id="plugin-toolbar" class="plugin-common-modal plugin-common-hidden">
                <div id="plugin-toolbar-input"><input placeholder="plu multi" title="${title}"></div>
                <div class="plugin-toolbar-result"></div>
            </div>`
    }

    init = () => {
        this.canInput = true;

        this.entities = {
            content: this.utils.entities.eContent,
            toolbar: document.querySelector("#plugin-toolbar"),
            input: document.querySelector("#plugin-toolbar-input input"),
            result: document.querySelector("#plugin-toolbar .plugin-toolbar-result")
        }

        this.search = this.utils.debounce(async ev => {
            const result = await this.toolController.handleInput();
            const ok = result && result.matches && result.tool;
            this.entities.result.innerHTML = ok ? this._newItems(result).join("") : "";
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
        }, this.config.DEBOUNCE_INTERVAL)
    }

    process = () => {
        this.entities.input.addEventListener("keydown", ev => {
            switch (ev.key) {
                case "Enter":
                    const select = this.entities.result.querySelector(".plugin-toolbar-item.active")
                        || (this.entities.result.childElementCount === 1 && this.entities.result.firstChild);
                    if (select) {
                        this._callTool(select, ev);
                    }
                    break
                case "ArrowUp":
                case "ArrowDown":
                    ev.stopPropagation();
                    ev.preventDefault();
                    this.utils.scrollActiveItem(this.entities.result, ".plugin-toolbar-item.active", ev.key === "ArrowDown");
                    break
                case "Escape":
                case "Backspace":
                    if (ev.key === "Escape" || (ev.key === "Backspace" && this.config.BACKSPACE_TO_HIDE && !this.entities.input.value)) {
                        ev.stopPropagation();
                        ev.preventDefault();
                        this.hide();
                    }
                    break
            }
        })

        this.entities.input.addEventListener("input", ev => this.canInput && this.search(ev))

        this.entities.result.addEventListener("click", ev => {
            const target = ev.target.closest(".plugin-toolbar-item");
            target && this._callTool(target, ev);
        });

        if (this.config.AUTO_HIDE) {
            this.entities.content.addEventListener("click", ev => {
                const needHide = this.utils.isShow(this.entities.toolbar) && !ev.target.closest("#plugin-toolbar")
                if (needHide) {
                    this.hide()
                }
            })
        }

        if (this.config.PAUSE_ON_COMPOSITION) {
            this.entities.input.addEventListener("compositionstart", () => this.canInput = false, true);
            this.entities.input.addEventListener("compositionend", async () => {
                this.canInput = true;
                await this.search();
            });
        }
    }

    call = () => {
        setTimeout(async () => {
            if (this.utils.isShow(this.entities.toolbar)) {
                this.hide();
            } else {
                await this.show();
            }
        })
    }

    _callTool = (target, ev) => {
        if (ev) {
            ev.preventDefault()
            ev.stopPropagation()
        }
        const { tool, value, meta } = target.dataset
        this.toolController.callback(tool, value, meta)
        if (tool === "func") {
            this.entities.input.focus()
        } else {
            this.hide()
        }
    }

    _newItems = ({ tool, matches, input }) => {
        const toolName = tool.name()
        return matches.map(match => {
            const showName = match.showName || match
            const fixedName = match.fixedName || match
            const meta = match.meta || ""
            let content = this.utils.escape(showName)
            if (input[0]) {
                input.forEach(part => content = content.replace(new RegExp(part, "gi"), "<b>$&</b>"))
            }
            const metaContent = meta ? `data-meta="${meta}"` : ""
            return `<div class="plugin-toolbar-item" data-value="${fixedName}" data-tool="${toolName}" ${metaContent}>${content}</div>`
        })
    }

    show = async () => {
        this.toolController.setAnchorNode();
        const widthRatio = this.config.TOOLBAR_WIDTH_PERCENT / 100;
        const { width, left } = this.entities.content.getBoundingClientRect();
        this.entities.toolbar.style.width = width * widthRatio + "px";
        this.entities.toolbar.style.left = left + width * (1 - widthRatio) / 2 + "px";
        this.utils.show(this.entities.toolbar);
        this.entities.input.select();
        await this.search();
    }

    hide = () => {
        this.utils.hide(this.entities.toolbar);
        this.entities.input.value = "";
        this.entities.result.innerHTML = "";
    }
}

class baseToolInterface {
    name = () => ""
    translate = () => ""
    icon = () => "🎯"
    init = () => null
    search = async input => null  // Return []string or [{ showName:"", fixedName:"", meta:"" }]
    callback = (fixedName, meta) => null
    baseSearch = (input, list, searchFields) => {
        if (input === "") return list;

        input = input.toLowerCase();
        const func = searchFields
            ? item => searchFields.some(field => item[field].toLowerCase().indexOf(input) !== -1)
            : item => item.toLowerCase().indexOf(input) !== -1
        return list.filter(func)
    }
}

class toolController {
    constructor(plugin) {
        this.plugin = plugin;
        this.utils = plugin.utils;
        this.i18n = plugin.i18n;
        this.tools = new Map();  // map[short]tool
        this.anchorNode = null;
    }

    register = tool => {
        tool.controller = this;
        tool.utils = this.utils;
        tool.i18n = this.i18n;
        tool.init();

        const short = tool.name();
        this.tools.set(short, tool);
    }

    unregister = name => this.tools.delete(name);

    callback = (toolName, fixedName, meta) => {
        const tool = this.tools.get(toolName);
        tool && tool.callback(fixedName, meta);
    }

    setAnchorNode = () => this.anchorNode = this.utils.getAnchorNode();

    intersect = arrays => {
        if (!Array.isArray(arrays) || arrays.length === 0 || arrays.some(ele => !ele)) return [];
        if (arrays.length === 1) return arrays[0]

        const func = (typeof arrays[0][0] === "string")
            ? ele => arrays.every(array => array.includes(ele))
            : ele => arrays.every(array => array.some(item => item.showName === ele.showName && item.fixedName === ele.fixedName && item.meta === ele.meta))
        return arrays[0].filter(func);
    }

    // Add a prefix to distinguish object and string items
    toUniqueString = item => typeof item === "object" ? `object: ${item.showName}${item.fixedName}${item.meta}` : `string: ${item}`

    union = arrays => {
        if (!Array.isArray(arrays) || arrays.length === 0) return []
        if (arrays.length === 1) return arrays[0]

        const set = new Set()
        const result = []
        for (const array of arrays) {
            for (const item of array) {
                const value = this.toUniqueString(item)
                if (!set.has(value)) {
                    set.add(value)
                    result.push(item)
                }
            }
        }
        return result
    }

    difference = (array1, array2) => {
        if (!Array.isArray(array1) || !Array.isArray(array2) || array1.length === 0 || array2.length === 0) return array1

        const set = new Set(array2.map(this.toUniqueString))
        return array1.filter(item => !set.has(this.toUniqueString(item)))
    }

    kind = input => {
        const all = input.split(" ").filter(Boolean);
        const positive = [];
        const negative = [];
        all.forEach(ele => {
            if (ele.startsWith("-")) {
                const value = ele.slice(1);
                value && negative.push(value);
            } else {
                positive.push(ele);
            }
        })
        positive.length === 0 && positive.push("");
        all.length === 0 && all.push("");
        return { all, positive, negative }
    }

    searchWithNeg = async (tool, positive, negative) => {
        const [posList, negList] = await Promise.all([
            Promise.all(positive.map(tool.search)),
            Promise.all(negative.map(tool.search)),
        ]);
        const posResult = this.intersect(posList);
        const negResult = this.union(negList);
        const matches = this.difference(posResult, negResult);
        return { inputList: positive, matches }
    }

    searchWithoutNeg = async (tool, all) => {
        const resultList = await Promise.all(all.map(tool.search));
        const matches = this.intersect(resultList);
        return { inputList: all, matches }
    }

    search = async (tool, input) => {
        const { all, positive, negative } = this.kind(input);
        if (this.plugin.config.USE_NEGATIVE_SEARCH) {
            return this.searchWithNeg(tool, positive, negative);
        } else {
            return this.searchWithoutNeg(tool, all);
        }
    }

    dispatch = raw => {
        raw = raw.trimLeft();
        for (const short of this.tools.keys()) {
            if (raw.startsWith(short + " ")) {
                return { tool: this.tools.get(short), input: raw.slice(short.length + 1).trim() }
            }
        }
        if (this.plugin.config.DEFAULT_TOOL) {
            return { tool: this.tools.get(this.plugin.config.DEFAULT_TOOL), input: raw.trim() }
        }
        return { tool: null, input: "" }
    }

    handleInput = async () => {
        const raw = this.plugin.entities.input.value;
        let { tool, input } = this.dispatch(raw);
        if (!tool) return

        const { inputList, matches } = await this.search(tool, input);
        if (matches && matches.length) {
            return { tool, input: inputList, matches }
        }
    }
}

class tabTool extends baseToolInterface {
    name = () => "tab"
    translate = () => this.i18n.t("tool.tab")
    icon = () => "📖"
    init = () => {
        const callback = () => this.windowTabPlugin = this.utils.getPlugin("window_tab")
        this.utils.eventHub.addEventListener(this.utils.eventHub.eventType.allPluginsHadInjected, callback)
    }
    search = async input => {
        if (!this.windowTabPlugin) return
        const current = this.utils.getFilePath()
        const paths = this.windowTabPlugin.tabUtil.tabs.filter(tab => tab.path !== current).map(tab => tab.path)
        return this.baseSearch(input, paths)
    }
    callback = fixedName => this.windowTabPlugin.switchTabByPath(fixedName)
}

class pluginTool extends baseToolInterface {
    name = () => "plu"
    translate = () => this.i18n.t("tool.plu")
    icon = () => "🔌"
    collectAll = () => {
        return Object.entries(this.utils.getAllPlugins())
            .filter(([_, plugin]) => plugin.call)
            .flatMap(([fixedName, plugin]) => {
                const chineseName = plugin.pluginName
                const staticActions = plugin.staticActions || []
                const dynamicActions = this.utils.updatePluginDynamicActions(fixedName, this.controller.anchorNode, true) || []
                const actions = [...staticActions, ...dynamicActions]
                return actions.length === 0
                    ? [{ showName: chineseName, fixedName: fixedName }]
                    : actions
                        .filter(act => !act.act_disabled && !act.act_hidden)
                        .map(act => ({ showName: `${chineseName} - ${act.act_name}`, fixedName: fixedName, meta: act.act_value }))
            })
            .map(plugin => {
                plugin.showName += (plugin.meta) ? ` （ ${plugin.fixedName} - ${plugin.meta} ）` : ` （ ${plugin.fixedName} ）`
                return plugin
            })
    }
    search = async input => {
        const pluginsList = this.collectAll();
        return this.baseSearch(input, pluginsList, ["showName"])
    }
    callback = (fixedName, action) => {
        this.utils.updateAndCallPluginDynamicAction(fixedName, action, this.controller.anchorNode)
    }
}

class recentFileTool extends baseToolInterface {
    name = () => "his"
    translate = () => this.i18n.t("tool.his")
    icon = () => "🕖"
    getRecentFile = async () => {
        if (!File.isNode) return

        const result = []
        const blank = "\u00A0".repeat(3)
        const { files, folders } = await this.utils.getRecentFiles()
        const add = (list, meta) => {
            for (const file of list) {
                if (file.path) {
                    const prefix = (meta === "file") ? "📄" : "📁"
                    const item = { showName: `${prefix}${blank}${file.path}`, fixedName: file.path, meta: meta }
                    result.push(item)
                }
            }
        }
        add(folders, "folder")
        add(files, "file")
        return result
    }
    search = async input => {
        let files = await this.getRecentFile();
        if (!files || files.length === 0) return;

        const current = this.utils.getFilePath();
        files = files.filter(file => file.fixedName !== current); // remove the current file
        return this.baseSearch(input, files, ["showName"])
    }
    callback = (fixedName, meta) => {
        if (meta === "file") {
            this.utils.openFile(fixedName);
        } else if (meta === "folder") {
            this.utils.openFolder(fixedName);
        }
    }
}

class operationTool extends baseToolInterface {
    name = () => "ops"
    translate = () => this.i18n.t("tool.ops")
    icon = () => "🔨"
    init = () => {
        const explorer = () => this.utils.showInFinder(this.utils.getFilePath())
        const copyPath = () => File.editor.UserOp.setClipboard(null, null, this.utils.getFilePath())
        const togglePreferencePanel = () => File.megaMenu.togglePreferencePanel()
        const openSettingFolder = () => this.utils.settings.openSettingFolder()
        const togglePinWindow = () => {
            const pined = document.body.classList.contains("always-on-top")
            const func = pined ? "unpinWindow" : "pinWindow"
            ClientCommand[func]()
        }
        const openFileInNewWindow = () => File.editor.library.openFileInNewWindow(this.utils.getFilePath(), false)
        this.ops = [
            { fixedName: "explorer", callback: explorer },
            { fixedName: "copyPath", callback: copyPath },
            { fixedName: "togglePreferencePanel", callback: togglePreferencePanel },
            { fixedName: "togglePinWindow", callback: togglePinWindow },
            { fixedName: "openFileInNewWindow", callback: openFileInNewWindow },
            { fixedName: "openSettingFolder", callback: openSettingFolder },
        ]
        this.ops.forEach(op => {
            const name = this.i18n.t("tool.ops." + op.fixedName)
            op.showName = `${name} - ${op.fixedName}`
        })
    }
    search = async input => this.baseSearch(input, this.ops, ["showName"])
    callback = (fixedName, meta) => {
        const op = this.ops.find(ele => ele.fixedName === fixedName)
        op && op.callback(meta)
    }
}

class modeTool extends baseToolInterface {
    name = () => "mode"
    translate = () => this.i18n.t("tool.mode")
    icon = () => "🌗"
    init = () => {
        const outlineView = () => {
            File.editor.library.toggleSidebar();
            File.isNode && ClientCommand.refreshViewMenu();
        }
        this.modes = [
            { fixedName: "outlineView", callback: outlineView },
            { fixedName: "sourceMode", callback: () => File.toggleSourceMode() },
            { fixedName: "focusMode", callback: () => File.editor.toggleFocusMode() },
            { fixedName: "typewriterMode", callback: () => File.editor.toggleTypeWriterMode() },
        ]
        this.utils.eventHub.addEventListener(this.utils.eventHub.eventType.allPluginsHadInjected, () => {
            const readonly = this.utils.getPlugin("read_only");
            const blur = this.utils.getPlugin("blur");
            const dark = this.utils.getPlugin("dark");
            const noImage = this.utils.getPlugin("no_image");
            const image = this.utils.getCustomPlugin("imageReviewer");

            readonly && this.modes.push({ fixedName: "readOnlyMode", callback: () => readonly.call() });
            blur && this.modes.push({ fixedName: "blurMode", callback: () => blur.call() });
            dark && this.modes.push({ fixedName: "dark", callback: () => dark.call() });
            image && this.modes.push({ fixedName: "imageReviewer", callback: () => image.callback() });
            noImage && this.modes.push({ fixedName: "no_image", callback: () => noImage.call() });
            this.modes.push({ fixedName: "debugMode", callback: () => JSBridge.invoke("window.toggleDevTools") });

            this.modes.forEach(mode => {
                const name = this.i18n.t("tool.mode." + mode.fixedName)
                mode.showName = `${name} - ${mode.fixedName}`
            });
        })
    }
    search = async input => this.baseSearch(input, this.modes, ["showName"])
    callback = (fixedName, meta) => {
        const mode = this.modes.find(ele => ele.fixedName === fixedName);
        mode && mode.callback(meta);
    }
}

class themeTool extends baseToolInterface {
    name = () => "theme"
    translate = () => this.i18n.t("tool.theme")
    icon = () => "🎨"
    setThemeForever = theme => ClientCommand.setTheme(theme);
    // setThemeTemp = theme => File.setTheme(theme)
    search = async input => {
        const { all, current } = await JSBridge.invoke("setting.getThemes");
        const list = all.map(theme => ({ showName: theme.replace(/\.css$/gi, ""), fixedName: theme }))
        return this.baseSearch(input, list, ["showName"]);
    }
    callback = fixedName => this.setThemeForever(fixedName);
}

class outlineTool extends baseToolInterface {
    name = () => "out"
    translate = () => this.i18n.t("tool.out")
    icon = () => "🧷"
    getAll = () => {
        const headers = File.editor.nodeMap.toc && File.editor.nodeMap.toc.headers
        if (!headers) return []
        return headers.flatMap(header => {
            const { attributes, cid } = header || {}
            return (attributes && cid)
                ? [{ showName: attributes.pattern.replace("{0}", attributes.text), fixedName: cid }]
                : []
        })
    }
    search = async input => this.baseSearch(input, this.getAll(), ["showName"])
    callback = fixedName => this.utils.scrollByCid(fixedName)
}

class functionTool extends baseToolInterface {
    name = () => "func"
    translate = () => this.i18n.t("tool.func")
    icon = () => "💡"
    search = async input => {
        const blank = "\u00A0".repeat(3)
        const all = Array.from(this.controller.tools.entries(), ([name, tool]) => ({
            showName: tool.icon() + blank + name + " - " + tool.translate(),
            fixedName: name
        }))
        return this.baseSearch(input, all, ["showName"])
    }
    callback = fixedName => {
        const { input } = this.controller.plugin.entities;
        input.value = fixedName + " ";
        input.dispatchEvent(new Event("input"));
    }
}

class mixTool extends baseToolInterface {
    name = () => "all"
    translate = () => this.i18n.t("tool.all")
    icon = () => "🔱"
    search = async input => {
        const toolName = this.name()
        const blank = "\u00A0".repeat(3)
        const promises = [...this.controller.tools.entries()]
            .filter(([name]) => name !== toolName)
            .map(async ([name, tool]) => {
                const result = await tool.search(input)
                if (!result) return []
                return result.map(ele => {
                    const meta = `${name}@${ele.meta || ""}`
                    const item = typeof ele === "string" ? { showName: ele, fixedName: ele, meta } : { ...ele, meta }
                    item.showName = `${tool.icon()}${blank}${item.showName}`
                    return item
                })
            })
        const toolResult = await Promise.all(promises)
        return toolResult.flat().filter(Boolean)
    }
    callback = (fixedName, meta) => {
        const at = meta.indexOf("@")
        const tool = meta.slice(0, at)
        const realMeta = meta.slice(at + 1)
        const t = this.controller.tools.get(tool)
        t && t.callback(fixedName, realMeta)
    }
}

module.exports = {
    plugin: toolbarPlugin,
    baseToolInterface,
}
