class autoNumberPlugin extends BasePlugin {
    beforeProcess = () => {
        this.separator = "@"
        this.css_id = this.utils.styleTemplater.getID(this.fixedName)
        this.initCSS()
    }

    style = () => ({ textID: this.css_id, text: this.getCSS() })

    process = () => {
        this.utils.settings.autoSaveSettings(this)
        if (this.config.ENABLE_WHEN_EXPORT) {
            new exportHelper(this).process()
        }
        if (this.config.ENABLE_IMAGE && this.config.SHOW_IMAGE_NAME) {
            this.utils.eventHub.addEventListener(this.utils.eventHub.eventType.fileEdited, () => {
                const images = this.utils.entities.querySelectorAllInWrite(".md-image:not([data-alt]) > img")
                for (const image of images) {
                    image.parentElement.dataset.alt = image.getAttribute("alt")
                }
            })
        }
    }

    initCSS = () => {
        const layout = (this.config.LAYOUTS.find(e => e.selected) || this.config.LAYOUTS[0]).layout

        this.base_css = `
        :root { ${this._buildCSSVar(layout)} }
        #write { counter-reset: content-h1 content-h2 image table fence; }
        #write > h1 { counter-set: content-h2; }
        #write > h2 { counter-set: content-h3; }
        #write > h3 { counter-set: content-h4; }
        #write > h4 { counter-set: content-h5; }
        #write > h5 { counter-set: content-h6; }
        `

        this.content_css = `
        #write > h1:before,
        #write > h1.md-focus.md-heading:before {
            counter-increment: content-h1;
            content: var(--count-content-h1);
        }
        
        #write > h2:before,
        #write > h2.md-focus.md-heading:before {
            counter-increment: content-h2;
            content: var(--count-content-h2);
        }
        
        #write > h3:before,
        #write > h3.md-focus.md-heading:before {
            counter-increment: content-h3;
            content: var(--count-content-h3);
        }
        
        #write > h4:before,
        #write > h4.md-focus.md-heading:before {
            counter-increment: content-h4;
            content: var(--count-content-h4);
        }
        
        #write > h5:before,
        #write > h5.md-focus.md-heading:before {
            counter-increment: content-h5;
            content: var(--count-content-h5);
        }
        
        #write > h6:before,
        #write > h6.md-focus.md-heading:before {
            counter-increment: content-h6;
            content: var(--count-content-h6);
        }
        
        #write > h3.md-focus:before,
        #write > h4.md-focus:before,
        #write > h5.md-focus:before,
        #write > h6.md-focus:before,
        h3.md-focus:before,
        h4.md-focus:before,
        h5.md-focus:before,
        h6.md-focus:before {
            color: inherit;
            border: inherit;
            border-radius: inherit;
            position: inherit;
            left: initial;
            float: none;
            top: initial;
            font-size: inherit;
            padding-left: inherit;
            padding-right: inherit;
            vertical-align: inherit;
            font-weight: inherit;
            line-height: inherit;
            visibility: inherit;
        }`

        this.outline_css = `
        .outline-content { counter-reset: outline-h1 outline-h2; }
        .outline-h1 { counter-set: outline-h2; }
        .outline-h2 { counter-set: outline-h3; }
        .outline-h3 { counter-set: outline-h4; }
        .outline-h4 { counter-set: outline-h5; }
        .outline-h5 { counter-set: outline-h6; }
        
        .outline-content .outline-h1 .outline-label:before {
            counter-increment: outline-h1;
            content: var(--count-outline-h1);
        }
        
        .outline-content .outline-h2 .outline-label:before {
            counter-increment: outline-h2;
            content: var(--count-outline-h2);
        }
        
        .outline-content .outline-h3 .outline-label:before {
            counter-increment: outline-h3;
            content: var(--count-outline-h3);
        }
        
        .outline-content .outline-h4 .outline-label:before {
            counter-increment: outline-h4;
            content: var(--count-outline-h4);
        }
        
        .outline-content .outline-h5 .outline-label:before {
            counter-increment: outline-h5;
            content: var(--count-outline-h5);
        }
        
        .outline-content .outline-h6 .outline-label:before {
            counter-increment: outline-h6;
            content: var(--count-outline-h6);
        }`

        this.toc_css = `
        .md-toc-content { counter-reset: toc-h1 toc-h2; }
        .md-toc-h1 { counter-set: toc-h2; }
        .md-toc-h2 { counter-set: toc-h3; }
        .md-toc-h3 { counter-set: toc-h4; }
        .md-toc-h4 { counter-set: toc-h5; }
        .md-toc-h5 { counter-set: toc-h6; }
        
        .md-toc-content .md-toc-h1 a:before {
            counter-increment: toc-h1;
            content: var(--count-toc-h1);
        }
        
        .md-toc-content .md-toc-h2 a:before {
            counter-increment: toc-h2;
            content: var(--count-toc-h2);
        }
        
        .md-toc-content .md-toc-h3 a:before {
            counter-increment: toc-h3;
            content: var(--count-toc-h3);
        }
        
        .md-toc-content .md-toc-h4 a:before {
            counter-increment: toc-h4;
            content: var(--count-toc-h4);
        }
        
        .md-toc-content .md-toc-h5 a:before {
            counter-increment: toc-h5;
            content: var(--count-toc-h5);
        }
        
        .md-toc-content .md-toc-h6 a:before {
            counter-increment: toc-h6;
            content: var(--count-toc-h6);
        }`

        this.table_css = `
        #write .table-figure::${this.config.POSITION_TABLE} {
            counter-increment: table;
            content: var(--count-table);
            font-family: ${this.config.FONT_FAMILY};
            display: block;
            text-align: ${this.config.ALIGN};
            margin: 4px 0;
        }`

        this.fence_css = `
        #write .md-fences {
            margin-bottom: 2.4em;
        }
        #write .md-fences::after {
            counter-increment: fence;
            content: var(--count-fence);
            position: absolute;
            width: 100%;
            text-align: ${this.config.ALIGN};
            font-family: ${this.config.FONT_FAMILY};
            margin: 0.6em 0;
            font-size: 1.1em;
            z-index: 9;
        }
        #write .md-fences.md-fences-advanced.md-focus::after {
            content: ""
        }`

        const image_content = `
            counter-increment: image;
            content: var(--count-image);
            font-family: ${this.config.FONT_FAMILY};
            display: block;
            text-align: ${this.config.ALIGN};
            margin: 4px 0;
        `
        this.image_css = `#write .md-image::after {${image_content}}`
        this.image_export_css = `#write p:has(img:first-child)::after {${image_content}}`
    }

    getCSS = (inExport = false) => {
        const { ENABLE_CONTENT, ENABLE_OUTLINE, ENABLE_TOC, ENABLE_IMAGE, ENABLE_TABLE, ENABLE_FENCE } = this.config
        const image_css = (inExport && this.utils.supportHasSelector) ? this.image_export_css : this.image_css
        const css = [
            this.base_css,
            ENABLE_CONTENT ? this.content_css : null,
            ENABLE_OUTLINE ? this.outline_css : null,
            ENABLE_TOC ? this.toc_css : null,
            ENABLE_TABLE ? this.table_css : null,
            ENABLE_FENCE ? this.fence_css : null,
            ENABLE_IMAGE ? image_css : null,
        ]
        return css.filter(Boolean).join("\n")
    }

    getDynamicActions = () => {
        const layouts = this.config.LAYOUTS.map(lo => ({
            act_name: lo.name,
            act_value: "set_layout" + this.separator + lo.name,
            act_state: lo.selected,
        }))
        return this.i18n.fillActions([
            { act_value: "toggle_outline", act_state: this.config.ENABLE_OUTLINE },
            { act_value: "toggle_content", act_state: this.config.ENABLE_CONTENT },
            { act_value: "toggle_toc", act_state: this.config.ENABLE_TOC },
            { act_value: "toggle_table", act_state: this.config.ENABLE_TABLE },
            { act_value: "toggle_image", act_state: this.config.ENABLE_IMAGE },
            { act_value: "toggle_fence", act_state: this.config.ENABLE_FENCE },
            ...layouts,
        ])
    }

    call = action => {
        const toggleSetting = toggle => {
            this.config[toggle] = !this.config[toggle]
            this.utils.removeStyle(this.css_id)
            this.utils.insertStyle(this.css_id, this.getCSS())
        }
        const callMap = {
            toggle_outline: () => toggleSetting("ENABLE_OUTLINE"),
            toggle_content: () => toggleSetting("ENABLE_CONTENT"),
            toggle_toc: () => toggleSetting("ENABLE_TOC"),
            toggle_table: () => toggleSetting("ENABLE_TABLE"),
            toggle_image: () => toggleSetting("ENABLE_IMAGE"),
            toggle_fence: () => toggleSetting("ENABLE_FENCE"),
            set_layout: layoutName => {
                this.config.LAYOUTS = this.config.LAYOUTS.map(lo => {
                    lo.selected = lo.name === layoutName
                    return lo
                })
                this.initCSS()
                this.utils.insertStyle(this.css_id, this.getCSS())
            },
        }
        const [act, meta] = action.split(this.separator, 2)
        const func = callMap[act]
        if (func) {
            func(meta)
        }
    }

    _buildCSSVar = layout => {
        const NAMES = {
            c1: "content-h1",
            c2: "content-h2",
            c3: "content-h3",
            c4: "content-h4",
            c5: "content-h5",
            c6: "content-h6",
            o1: "outline-h1",
            o2: "outline-h2",
            o3: "outline-h3",
            o4: "outline-h4",
            o5: "outline-h5",
            o6: "outline-h6",
            t1: "toc-h1",
            t2: "toc-h2",
            t3: "toc-h3",
            t4: "toc-h4",
            t5: "toc-h5",
            t6: "toc-h6",
            t: "table",
            f: "fence",
            i: "image",
        }
        const STYLES = {
            d: "decimal",
            dlz: "decimal-leading-zero",
            lr: "lower-roman",
            ur: "upper-roman",
            la: "lower-alpha",
            ua: "upper-alpha",
            lg: "lower-greek",
            hs: "cjk-heavenly-stem",
            eb: "cjk-earthly-branch",
            cjk: "cjk-ideographic",  // cjk-decimal is experimental
            scf: "simp-chinese-formal",
            tcf: "trad-chinese-formal",
            jf: "japanese-formal",
            hi: "hiragana",
            ka: "katakana",
            di: "disc",
            ci: "circle",
            sq: "square",
            no: "none",
        }
        const DEFAULT_STYLE = "d"

        const joinKeys = (obj) => [...Object.keys(obj)].sort((a, b) => b.length - a.length).join("|")
        const names = joinKeys(NAMES)
        const styles = joinKeys(STYLES)
        const regex = new RegExp(`\\{\\s*(${names})(?::(${styles}))?\\s*\\}`, "gi")

        const buildCounter = (type, lo) => {
            let start = 0
            const content = []
            for (const match of lo.matchAll(regex)) {
                const [raw, name, style = DEFAULT_STYLE] = match
                const idx = match.index
                const text = lo.slice(start, idx)
                if (text) {
                    content.push(`"${text}"`)
                }
                content.push(`counter(${NAMES[name]}, ${STYLES[style]})`)
                start = idx + raw.length
            }
            const remain = lo.slice(start)
            if (remain) {
                content.push(`"${remain}"`)
            }
            const val = content.length ? content.join(" ") : `""`
            return `--count-${type}: ${val}`
        }

        const vars = Object.entries(layout).map(([type, lo]) => {
            const extra = type === "image" ? ` " " attr(data-alt)` : ""
            const counter = buildCounter(type, lo)
            return counter + extra + ";"
        })
        return vars.join("\n")
    }
}

// Adds CSS on export and resolves the issue of missing numbering in the PDF export table of contents.
class exportHelper {
    constructor(plugin) {
        this.inExport = false;
        this.plugin = plugin;
    }

    beforeExport = () => {
        this.inExport = true
        return `body {font-variant-ligatures: no-common-ligatures;} ` + this.plugin.getCSS(true)
    }

    afterGetHeaderMatrix = headers => {
        if (!this.inExport) return
        this.inExport = false

        const N = { H2: 0, H3: 0, H4: 0, H5: 0, H6: 0 }
        headers.forEach(header => {
            const tagName = "H" + header[0]
            if (!N.hasOwnProperty(tagName)) return

            let val = ""
            switch (tagName) {
                case "H1":
                    N.H2 = 0
                    break
                case "H2":
                    N.H3 = 0
                    N.H2++
                    val = `${N.H2}. `
                    break
                case "H3":
                    N.H4 = 0
                    N.H3++
                    val = `${N.H2}.${N.H3} `
                    break
                case "H4":
                    N.H5 = 0
                    N.H4++
                    val = `${N.H2}.${N.H3}.${N.H4} `
                    break
                case "H5":
                    N.H6 = 0
                    N.H5++
                    val = `${N.H2}.${N.H3}.${N.H4}.${N.H5} `
                    break
                case "H6":
                    N.H6++
                    val = `${N.H2}.${N.H3}.${N.H4}.${N.H5}.${N.H6} `
                    break
            }
            header[1] = val + header[1]
        })
    }

    process = () => {
        this.plugin.utils.exportHelper.register(this.plugin.fixedName, this.beforeExport)
        this.plugin.utils.decorate(
            () => File && File.editor && File.editor.library && File.editor.library.outline,
            "getHeaderMatrix",
            null,
            this.afterGetHeaderMatrix,
        )
    }
}

module.exports = {
    plugin: autoNumberPlugin
}
