class chartPlugin extends BaseCustomPlugin {
    init = () => this.ChartPkg = null

    callback = anchorNode => this.utils.insertText(anchorNode, this.config.TEMPLATE)

    process = () => {
        const parser = this.utils.thirdPartyDiagramParser
        parser.register({
            lang: this.config.LANGUAGE,
            mappingLang: "javascript",
            destroyWhenUpdate: false,
            interactiveMode: this.config.INTERACTIVE_MODE,
            checkSelector: ".plugin-chart-content",
            wrapElement: '<div class="plugin-chart-content"><canvas></canvas></div>',
            setStyleFunc: parser.STYLE_SETTER({
                height: this.config.DEFAULT_FENCE_HEIGHT,
                "background-color": this.config.DEFAULT_FENCE_BACKGROUND_COLOR
            }),
            lazyLoadFunc: this.lazyLoad,
            createFunc: this.create,
            updateFunc: null,
            destroyFunc: this.destroy,
            beforeExportToNative: null,
            beforeExportToHTML: this.beforeExportToHTML,
            extraStyleGetter: null,
            versionGetter: this.versionGetter,
        })
    }

    create = ($wrap, content) => {
        const $canvas = $wrap.find("canvas")
        if ($canvas.length) {
            const ctx = $canvas[0].getContext("2d")
            return this.drawChart(ctx, content)
        }
    }

    destroy = instance => {
        instance.clear()
        instance.destroy()
    }

    drawChart = (ctx, content) => {
        let config = {}
        const Chart = this.ChartPkg.Chart
        eval(content)
        return new Chart(ctx, config)
    }

    beforeExportToHTML = (preview, instance) => {
        const img = new Image()
        img.src = instance.toBase64Image()
        $(preview).html(img)
    }

    versionGetter = () => this.ChartPkg && this.ChartPkg.version

    lazyLoad = () => this.ChartPkg = require("./chart.min.js")
}

module.exports = {
    plugin: chartPlugin
}