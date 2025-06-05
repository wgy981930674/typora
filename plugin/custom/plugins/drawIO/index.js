class drawIOPlugin extends BaseCustomPlugin {
    styleTemplate = () => true

    init = () => this.defaultConfig = this._getDefaultConfig()

    callback = anchorNode => this.utils.insertText(anchorNode, this.config.TEMPLATE)

    process = () => {
        const parser = this.utils.thirdPartyDiagramParser
        parser.register({
            lang: this.config.LANGUAGE,
            mappingLang: "javascript",
            destroyWhenUpdate: false,
            interactiveMode: this.config.INTERACTIVE_MODE,
            checkSelector: ".plugin-drawio-content",
            wrapElement: '<div class="plugin-drawio-content"></div>',
            setStyleFunc: parser.STYLE_SETTER({
                height: this.config.DEFAULT_FENCE_HEIGHT,
                "background-color": this.config.DEFAULT_FENCE_BACKGROUND_COLOR,
            }),
            lazyLoadFunc: this.lazyLoad,
            createFunc: this.create,
            updateFunc: null,
            destroyFunc: null,
            beforeExportToNative: null,
            beforeExportToHTML: this.beforeExportToHTML,
            extraStyleGetter: null,
            versionGetter: this.versionGetter,
        })
    }

    create = async ($wrap, content) => {
        const graphConfig = this.utils.safeEval(content)
        if (!graphConfig.source && !graphConfig.xml) {
            throw new Error(this.i18n.t("error.messingSource"))
        }
        await this._setXML(graphConfig)
        $wrap[0].innerHTML = await this._toElement(graphConfig)
        this._refresh()
        return $wrap[0]
    }

    _setXML = async graphConfig => {
        if (graphConfig.xml) return

        let { source } = graphConfig
        const isNetwork = this.utils.isNetworkURI(source)
        try {
            if (isNetwork) {
                graphConfig.xml = await this._memorizedFetch(source)
            } else {
                const dir = this.utils.getCurrentDirPath()
                source = this.utils.Package.Path.resolve(dir, source)
                graphConfig.xml = await this.utils.Package.Fs.promises.readFile(source, "utf-8")
            }
        } catch (e) {
            const msg = this.i18n.t(isNetwork ? "error.getFileFailedFromNetwork" : "error.getFileFailedFromLocal")
            throw new Error(`${msg}: ${source}\n\n${e}`)
        }
    }

    _toElement = graphConfig => {
        const mxGraphData = { ...this.defaultConfig, ...graphConfig }
        const jsonString = JSON.stringify(mxGraphData)
        const escaped = this.utils.escape(jsonString)
        return `<div class="mxgraph" style="max-width:100%; margin: 26px auto 0;" data-mxgraph="${escaped}"></div>`
    }

    _refresh = this.utils.debounce(() => window.GraphViewer.processElements(), 100)

    _memorizedFetch = this.utils.memorize(async url => {
        console.debug(`memorized fetch url: ${url}`)
        const resp = await this.utils.fetch(url, { timeout: 30 * 1000 })
        return resp.text()
    })

    _getDefaultConfig = (type = "showOnly") => {
        const config = {
            showOnly: { highlight: "#0000ff", nav: false, resize: false, edit: null, editable: true, lightbox: false, zoom: "1", toolbar: null, "toolbar-nohide": true, },
            editable: { highlight: "#0000ff", nav: false, resize: true, edit: null, editable: false, toolbar: null, "toolbar-nohide": true, },
            showToolbar: {
                highlight: "#0000ff",
                nav: true,
                resize: true,
                edit: null,
                editable: true,
                lightbox: false,
                zoom: "1",
                toolbar: "zoom lightbox layers",
                "toolbar-position": "inline",
                "toolbar-nohide": true,
            },
        }
        return config[type]
    }

    lazyLoad = async () => {
        const from = this.config.RESOURCE_URI
        const path = this.utils.isNetworkURI(from) ? from : `file:///${this.utils.Package.Path.resolve(from)}`
        await $.getScript(path)
        window.GraphViewer.prototype.toolbarZIndex = 7
    }

    beforeExportToHTML = (preview, instance) => {
        const graph = preview.querySelector(".mxgraph")
        if (graph) {
            graph.removeAttribute("data-mxgraph")
            graph.querySelectorAll(":scope > *:not(svg)").forEach(this.utils.removeElement)
        }
    }

    versionGetter = () => "24.8.9"
}

module.exports = {
    plugin: drawIOPlugin,
}
