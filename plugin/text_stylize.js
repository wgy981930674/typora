class textStylizePlugin extends BasePlugin {
    styleTemplate = () => ({ backgroundColor: this.config.MODAL_BACKGROUND_COLOR || "var(--side-bar-bg-color)" })

    html = () => {
        const svgMap = {
            blank: "",
            weight: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z"/></svg>',
            italic: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z"/></svg>',
            underline: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z"/></svg>',
            throughline: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M80-400v-80h800v80H80Zm340-160v-120H200v-120h560v120H540v120H420Zm0 400v-160h120v160H420Z"/></svg>',
            overline: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-760v-80h560v80H200Zm280 640q-117 0-198.5-81.5T200-400q0-117 81.5-198.5T480-680q117 0 198.5 81.5T760-400q0 117-81.5 198.5T480-120Zm0-100q75 0 127.5-52.5T660-400q0-75-52.5-127.5T480-580q-75 0-127.5 52.5T300-400q0 75 52.5 127.5T480-220Z"/></svg>',
            superScript: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M760-600v-80q0-17 11.5-28.5T800-720h80v-40H760v-40h120q17 0 28.5 11.5T920-760v40q0 17-11.5 28.5T880-680h-80v40h120v40H760ZM235-160l185-291-172-269h106l124 200h4l123-200h107L539-451l186 291H618L482-377h-4L342-160H235Z"/></svg>',
            subScript: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M760-160v-80q0-17 11.5-28.5T800-280h80v-40H760v-40h120q17 0 28.5 11.5T920-320v40q0 17-11.5 28.5T880-240h-80v40h120v40H760Zm-525-80 185-291-172-269h106l124 200h4l123-200h107L539-531l186 291H618L482-457h-4L342-240H235Z"/></svg>',
            emphasis: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M477-80q-83 0-156-31.5T194-197q-54-54-85.5-127T77-480q0-83 31.5-156T194-763q54-54 127-85.5T477-880q83 0 156 31.5T760-763q54 54 85.5 127T877-480q0 83-31.5 156T760-197q-54 54-127 85.5T477-80Zm91-93q78-23 135.5-80.5T784-389L568-173ZM171-574l212-212q-77 23-133 79t-79 133Zm-4 176 392-391q-12-3-24-5t-25-4L159-447q2 13 3.5 25t4.5 24Zm57 114 449-450q-8-6-16.5-12T639-757L200-318q5 9 11 17.5t13 16.5Zm91 81 438-439q-5-9-11-17.5T730-676L281-226q8 6 16.5 12t17.5 11Zm129 41 351-351q-2-13-4-25t-5-24L395-171q12 3 24 5t25 4Z"/></svg>',
            title: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M420-160v-520H200v-120h560v120H540v520H420Z"/></svg>',
            increaseSize: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m40-200 210-560h100l210 560h-96l-51-143H187l-51 143H40Zm176-224h168l-82-232h-4l-82 232Zm504 104v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z"/></svg>',
            decreaseSize: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m40-200 210-560h100l210 560h-96l-51-143H187l-51 143H40Zm176-224h168l-82-232h-4l-82 232Zm384-16v-80h320v80H600Z"/></svg>',
            increaseLetterSpacing: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-160v-640h80v640h-80Zm640 0v-640h80v640h-80ZM294-280l150-400h72l150 400h-70l-34-102H400l-36 102h-70Zm126-160h120l-58-166-62 166Z"/></svg>',
            decreaseLetterSpacing: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160v-640h80v640h-80Zm560 0v-640h80v640h-80ZM294-280l150-400h72l150 400h-69l-36-102H399l-36 102h-69Zm126-160h120l-58-166h-4l-58 166Z"/></svg>',
            family: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M186-80q-54 0-80-22t-26-66q0-58 49-74t116-16h21v-56q0-34-1-55.5t-6-35.5q-5-14-11.5-19.5T230-430q-9 0-16.5 3t-12.5 8q-4 5-5 10.5t1 11.5q6 11 14 21.5t8 24.5q0 25-17.5 42.5T159-291q-25 0-42.5-17.5T99-351q0-27 12-44t32.5-27q20.5-10 47.5-14t58-4q85 0 118 30.5T400-302v147q0 19 4.5 28t15.5 9q12 0 19.5-18t9.5-56h11q-3 62-23.5 87T368-80q-43 0-67.5-13.5T269-134q-10 29-29.5 41.5T186-80Zm373 0q-20 0-32.5-16.5T522-132l102-269q7-17 22-28t34-11q19 0 34 11t22 28l102 269q8 19-4.5 35.5T801-80q-12 0-22-7t-15-19l-20-58H616l-20 58q-4 11-14 18.5T559-80Zm-324-29q13 0 22-20.5t9-49.5v-67q-26 0-38 15.5T216-180v11q0 36 4 48t15 12Zm407-125h77l-39-114-38 114Zm-37-285q-48 0-76.5-33.5T500-643q0-104 66-170.5T735-880q42 0 68 9.5t26 24.5q0 6-2 12t-7 11q-5 7-12.5 10t-15.5 1q-14-4-32-7t-33-3q-71 0-114 48t-43 127q0 22 8 46t36 24q11 0 21.5-5t18.5-14q17-18 31.5-60T712-758q2-13 10.5-18.5T746-782q18 0 27.5 9.5T779-749q-12 43-17.5 75t-5.5 58q0 20 5.5 29t16.5 9q11 0 21.5-8t29.5-30q2-3 15-7 8 0 12 6t4 17q0 28-32 54t-67 26q-26 0-44.5-14T691-574q-15 26-37 40.5T605-519Zm-485-1v-220q0-58 41-99t99-41q58 0 99 41t41 99v220h-80v-80H200v80h-80Zm80-160h120v-60q0-25-17.5-42.5T260-800q-25 0-42.5 17.5T200-740v60Z"/></svg>',
            blur: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="25"><path d="M13.47 7.41158L15.93 6.20158C16.23 6.05158 16.31 5.66158 16.08 5.42158C15.19 4.44158 14.29 3.62158 13.57 3.00158C13.24 2.72158 12.75 2.95158 12.75 3.38158V6.96158C12.75 7.33158 13.14 7.57158 13.47 7.41158Z"/><path d="M12.75 19.7384V21.3884C12.75 21.6884 13.02 21.9384 13.32 21.8884C16.05 21.4384 18.33 19.6084 19.41 17.1484C19.6 16.7284 19.14 16.3084 18.72 16.5084L13.03 19.2984C12.86 19.3784 12.75 19.5484 12.75 19.7384Z"/><path d="M11.2505 3.36159C11.2505 2.93159 10.7605 2.70159 10.4305 2.97159C8.07046 4.95159 3.88046 9.12158 3.90046 13.9016C3.90046 17.9216 6.84046 21.2516 10.6805 21.8916C10.9805 21.9416 11.2505 21.6916 11.2505 21.3916V3.36159Z"/><path d="M13.4402 12.4714L18.7302 10.2514C19.0002 10.1314 19.1302 9.82141 19.0002 9.56141C18.6302 8.83141 18.2002 8.12141 17.7302 7.46141C17.5902 7.26141 17.3302 7.20141 17.1102 7.30141L13.0202 9.29141C12.8502 9.37141 12.7402 9.55141 12.7402 9.74141V12.0114C12.7502 12.3614 13.1102 12.6114 13.4402 12.4714Z"/><path d="M19.83 14.3107C19.99 14.2307 20.09 14.0807 20.09 13.9107C20.09 13.2707 20.01 12.6407 19.87 12.0207C19.8 11.7207 19.47 11.5607 19.19 11.6807L13.05 14.3007C12.87 14.3807 12.75 14.5607 12.75 14.7607V16.9607C12.75 17.3307 13.14 17.5707 13.47 17.4107L19.37 14.5407L19.83 14.3107Z"/></svg>',
            foregroundColor: '<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22"><path d="M80 0v-80Zm140-280 210-560h100l210 560h-96l-50-144H368l-52 144h-96Zm176-224h168l-82-232h-4l-82 232Z"/><path class="color-indicator" d="M80 0v-160h800V0"/></svg>',
            backgroundColor: '<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22"><path d="m247-904 57-56 343 343q23 23 23 57t-23 57L457-313q-23 23-57 23t-57-23L153-503q-23-23-23-57t23-57l190-191-96-96Zm153 153L209-560h382L400-751Zm360 471q-33 0-56.5-23.5T680-360q0-21 12.5-45t27.5-45q9-12 19-25t21-25q11 12 21 25t19 25q15 21 27.5 45t12.5 45q0 33-23.5 56.5T760-280ZM80 0"/><path class="color-indicator" d="M80 0v-160h800V0"/></svg>',
            borderColor: '<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22"><path d="M80 0v-800V0H80Zm160-320h56l312-311-29-29-28-28-311 312v56Zm-80 80v-170l448-447q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L330-240H160Zm560-504-56-56 56 56ZM608-631l-29-29-28-28 57 57Z"/><path class="color-indicator" d="M80 0v-160h800V0"/></svg>',
            setBrush: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>',
            useBrush: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>',
            erase: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m528-546-93-93-121-121h486v120H568l-40 94ZM792-56 460-388l-80 188H249l119-280L56-792l56-56 736 736-56 56Z"/></svg>',
            move: '<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22"><path d="M480-80 310-250l57-57 73 73v-166h80v165l72-73 58 58L480-80ZM250-310 80-480l169-169 57 57-72 72h166v80H235l73 72-58 58Zm460 0-57-57 73-73H560v-80h165l-73-72 58-58 170 170-170 170ZM440-560v-166l-73 73-57-57 170-170 170 170-57 57-73-73v166h-80Z"/></svg>',
            close: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>',
        }
        const hintMap = this.i18n.entries(Object.keys(svgMap), "$option.TOOLBAR.")

        const tools = this.config.TOOLBAR
            .filter(name => svgMap.hasOwnProperty(name))
            .map(name => {
                const svg = svgMap[name]
                const hint = hintMap[name]
                const style = name === "blank" ? 'style="visibility: hidden"' : ""
                return `<span action="${name}" ty-hint="${hint}" ${style}>${svg}</span>`
            })
            .join("")
        const trs = this.config.COLOR_TABLE
            .map(colors => {
                const tds = colors.map(c => `<td style="background-color: ${c}" data-color="${c}"></td>`).join("")
                return `<tr>${tds}</tr>`
            })
            .join("")

        return `
            <div id="plugin-text-stylize" class="plugin-common-modal plugin-common-hidden">
                <div class="stylize-tool">${tools}</div>       
                <table class="stylize-palette"><tbody>${trs}</tbody></table>     
            </div>
        `
    }

    hotkey = () => {
        const hotkeys = this.config.ACTION_HOTKEYS.map(({ hotkey, action }) => {
            const callback = () => {
                const color = (action === "foregroundColor" || action === "backgroundColor" || action === "borderColor")
                    ? this.entities.toolbar.querySelector(`[action=${action}]`).getAttribute("last-color")
                    : undefined;
                this.onAction(action, color);
            }
            return { hotkey, callback }
        })
        return [{ hotkey: this.config.SHOW_MODAL_HOTKEY, callback: this.call }, ...hotkeys];
    }

    init = () => {
        this.entities = {
            modal: document.querySelector("#plugin-text-stylize"),
            toolbar: document.querySelector("#plugin-text-stylize .stylize-tool"),
            palette: document.querySelector("#plugin-text-stylize .stylize-palette"),
        }
        this.styleSetter = new styleSetter(this, this.config.DEFAULT_FORMAT_BRUSH)
        this.setStyle = this.styleSetter.setStyle
    }

    process = () => {
        this.utils.dragFixedModal(this.entities.toolbar.querySelector(`[action="move"]`), this.entities.modal, false);
        this.utils.eventHub.addEventListener(this.utils.eventHub.eventType.toggleSettingPage, hide => hide && this.utils.hide(this.entities.modal));

        const that = this;
        $(this.entities.toolbar).on("mouseenter", "[action]", function () {
            const action = this.getAttribute("action");
            const showPalette = action === "foregroundColor" || action === "backgroundColor" || action === "borderColor";
            that.entities.toolbar.querySelectorAll(":scope > [action]").forEach(ele => ele.classList.remove("select"));
            this.classList.add("select");
            that.entities.palette.style.display = showPalette ? "block" : "none";
        })

        this.entities.toolbar.addEventListener("mousedown", ev => {
            if (!ev.target.closest(`[action="move"]`)) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            const target = ev.target.closest("[action]");
            if (!target) return;
            const action = target.getAttribute("action");
            const color = target.getAttribute("last-color");
            this.onAction(action, color);
        }, true)

        this.entities.palette.addEventListener("mousedown", ev => {
            ev.preventDefault();
            ev.stopPropagation();
            const td = ev.target.closest("td");
            if (!td) return;
            const color = td.dataset.color
            const target = this.entities.toolbar.querySelector(":scope > .select");
            target.querySelector("svg .color-indicator").setAttribute("fill", color);
            target.setAttribute("last-color", color);
            const action = target.getAttribute("action")
            this.onAction(action, color);
        }, true)
    }

    call = () => this.utils.toggleVisible(this.entities.modal);

    onAction = (action, color) => {
        const callMap = this.getFuncMap(color);
        const func = callMap[action];
        func && func();
    }

    getFuncMap = color => ({
        close: this.call,
        erase: this.clearAll,
        setBrush: this.setBrush,
        useBrush: this.useBrush,
        italic: this.toggleItalic,
        underline: this.toggleUnderline,
        throughline: this.toggleThroughline,
        overline: this.toggleOverline,
        superScript: this.toggleSuperScript,
        subScript: this.toggleSubScript,
        emphasis: () => this.toggleEmphasis("filled red"),
        blur: () => this.toggleBlur(0.5),
        weight: () => this.toggleWeight("bold"),
        title: () => this.toggleSize("2em"),
        increaseSize: () => this.increaseSize(0.1),
        decreaseSize: () => this.decreaseSize(0.1),
        increaseLetterSpacing: () => this.increaseLetterSpacing(1),
        decreaseLetterSpacing: () => this.decreaseLetterSpacing(1),
        family: () => this.toggleFamily("serif"),
        foregroundColor: () => this.toggleForegroundColor(color || this.config.DEFAULT_COLORS.FOREGROUND),
        backgroundColor: () => this.toggleBackgroundColor(color || this.config.DEFAULT_COLORS.BACKGROUND),
        borderColor: () => this.toggleBorder(`1px solid ${color || this.config.DEFAULT_COLORS.BORDER}`),
    })

    toggleForegroundColor = color => this.setStyle({ toggleMap: { color: color } });
    toggleBackgroundColor = color => this.setStyle({ toggleMap: { background: color } });
    toggleSize = size => this.setStyle({ toggleMap: { "font-size": size } });
    toggleWeight = weight => this.setStyle({ toggleMap: { "font-weight": weight } });
    toggleFamily = family => this.setStyle({ toggleMap: { "font-family": family } });
    toggleBorder = border => this.setStyle({ toggleMap: { border } });
    toggleEmphasis = emphasis => this.setStyle({ toggleMap: { "text-emphasis": emphasis } })
    toggleBlur = (num = 0.5) => this.setStyle({ mergeMap: { "filter": `blur(${num}em)` } })
    toggleItalic = () => this.setStyle({ toggleMap: { "font-style": "italic" } });
    toggleUnderline = () => this.setStyle({ mergeMap: { "text-decoration": "underline" } });
    toggleThroughline = () => this.setStyle({ mergeMap: { "text-decoration": "line-through" } });
    toggleOverline = () => this.setStyle({ mergeMap: { "text-decoration": "overline" } });
    toggleSuperScript = () => this.setStyle({ toggleMap: { "vertical-align": "super" } });
    toggleSubScript = () => this.setStyle({ toggleMap: { "vertical-align": "sub" } });
    setBrush = () => this.styleSetter.setBrush();
    useBrush = () => this.styleSetter.useBrush();
    clearAll = () => this.setStyle({ replaceMap: {} });
    increaseSize = (num = 0.1) => this.setStyle({
        hook: styleMap => {
            styleMap["font-size"] = styleMap["font-size"] || "1.0em";
            const origin = parseFloat(styleMap["font-size"]);
            const size = Math.max(0.1, (origin + num).toFixed(1));
            if (size !== 1) {
                styleMap["font-size"] = size + "em";
            } else {
                delete styleMap["font-size"]
            }
        }
    });
    decreaseSize = (num = 0.1) => this.increaseSize(-num);
    increaseLetterSpacing = (num = 1) => this.setStyle({
        hook: styleMap => {
            styleMap["letter-spacing"] = styleMap["letter-spacing"] || "1pt";
            const origin = parseInt(styleMap["letter-spacing"]);
            const spacing = Math.max(0, origin + num);
            if (spacing !== 0) {
                styleMap["letter-spacing"] = spacing + "pt";
            } else {
                delete styleMap["letter-spacing"];
            }
        }
    });
    decreaseLetterSpacing = (num = 1) => this.increaseLetterSpacing(-num);
}

/**
 * This code contains workarounds and hacks to address specific behaviors of Typora.
 * Understanding the intricacies may be challenging. This documentation outlines the implementation logic for future modifications.
 *
 * Core Idea: Simplify the problem by initially focusing on single-line selections.
 *
 * 1. Single-Line Selection Scenarios:
 *    Consider the example: `123<span style="color:#FF0000;">abc</span>defg`
 *    Four selection possibilities exist:
 *      a. No selection.
 *      b. Standard selection (e.g., "efg" - anything not covered by c and d).
 *      c. Selection within an existing styled span (e.g., "abc").
 *      d. Selection encompassing an entire styled span (e.g., `<span style="color:#FF0000;">abc</span>`).
 *
 * 2. Handling Simple Scenarios (a, b, and c):
 *      a. No selection: Insert an empty styled span (`<span style="XXX"></span>`) at the cursor.
 *      b. Standard selection: Wrap the selected text (e.g., "efg") with a styled span: `<span style="XXX">efg</span>`. Then, insert it back into the document.
 *      c. Selection within a span: Transform the selection into scenario d.  For example, "abc" becomes `<span style="color:#FF0000;">abc</span>`.
 *
 * 3. Handling Scenario d (Selecting an Existing Span):
 *      a. Deconstruct the example `123<span style="color:#FF0000;">abc</span>defg` into:
 *         - `beforeText`: "123" (Text before the span)
 *         - `innerText`: "abc" (Text inside the span)
 *         - `outerText`: `<span style="color:#FF0000;">abc</span>` (The entire span element)
 *         - `styleObject`: A JavaScript object representing the CSS style of the span (e.g., `{ color: '#FF0000' }`)
 *      b. Modify the `styleObject` as needed to apply the new styling.
 *      c. Reconstruct the `outerText` using the updated `innerText` and `styleObject`. Insert this new `outerText` back into the document.
 *      d. Use the `beforeText` and modified `styleObject` to determine the final position of the `innerText`.
 *         Move the bookmark (selection) to correctly re-select the `innerText`.
 *      e. The above steps are encapsulated in the `setInlineStyle` function.
 *
 * 4. Handling Multi-Line Selections:
 *    When the user selects text across multiple lines and potentially multiple tags, the process involves:
 *      a. Breaking the multi-line selection into individual lines.
 *      b. Applying the `setInlineStyle` function to each line.
 *
 *    Implementation details for multi-line handling (`genRanges` function):
 *      a. Use `TreeWalker` along with the `range` object's `commonAncestorContainer`, `startContainer`, and `endContainer` to get an array of all selected nodes (`nodeList`).
 *      b. Filter out unnecessary text nodes within `<span md-inline="softbreak" class="md-softbreak"> </span>` tags (generated by shift+enter for soft line breaks).
 *      c. Split the `nodeList` into lines based on `node.classList.contains("md-softbreak")` (soft breaks) and `!!node.getAttribute("cid")` (hard breaks).
 *         Use `range.setStart(startContainer, startOffset)` and `range.setEnd(endContainer, endOffset)` to define the selection range for each line.
 *      d. The `startContainer` and `endContainer` will be TEXT_NODEs. Filter out any ELEMENT_NODEs to get an array of lines (`selectLines`).
 *      e. `selectLines` is a 2D array where each element is an array of TEXT_NODEs for a single line.
 *         The `startContainer` and `endContainer` correspond to the first and last TEXT_NODEs of each line, respectively.
 *      f. Special handling is required for the first and last lines, as they might not be fully selected.
 *      g. After splitting, you'll have the `startContainer`, `startOffset`, `endContainer`, and `endOffset` for each individual line.
 *
 * 5. Addressing Typora's DOM Manipulation Issues:
 *    Typora modifies the paragraph's `innerHTML` after inserting a span, invalidating the previously obtained TEXT_NODEs in the ranges. The solution is:
 *      a. The `textContent` of the paragraph remains unchanged after the span insertion. Record the position of the old TEXT_NODEs in the document *before* inserting the span.
 *      b. After Typora updates the DOM, use the recorded positions to find the *new* TEXT_NODEs.
 *      c. Replace the old TEXT_NODEs with the new TEXT_NODEs in the ranges.
 *      d. Now the (updated) TEXT_NODEs are valid. Proceed to call `setInlineStyle`.
 *      e. The above process is implemented in `setMultilineStyle`.  `recordTEXTPosition` handles the recording, and `renewRange` handles the replacement.
 *
 * 6. Overall Styling Process:
 *    The main function `setStyle` orchestrates the entire process, calling `genRanges`, `setMultilineStyle`, and the helper functions as needed.
 */
class styleSetter {
    constructor(plugin, formatBrushString) {
        this.utils = plugin.utils
        this.formatBrushObj = this.parseStyleString(formatBrushString)
    }

    setStyle = ({ toggleMap, deleteMap, mergeMap, upsertMap, replaceMap, hook, moveBookmark = true, rememberFormat = false }) => {
        const args = { toggleMap, deleteMap, mergeMap, upsertMap, replaceMap, hook, moveBookmark, rememberFormat };
        const ranges = this.genRanges();
        if (!ranges || ranges.length === 0) {
            console.debug("has not ranges");
        } else if (ranges.length === 1) {
            this.setInlineStyle(args);
        } else {
            this.setMultilineStyle(ranges, args);
        }
    }

    setBrush = () => this.setStyle({ upsertMap: {}, rememberFormat: true });

    useBrush = () => this.setStyle({ replaceMap: this.formatBrushObj });

    /**
     * There are four possible user selection scenarios, for example: `123<span style="color:#FF0000;">abc</span>defg`
     *   a. No selection.
     *   b. Standard selection (e.g., "efg").
     *   c. Selection within an existing styled span (e.g., "abc"): Modify the outer text.
     *   d. Selection encompassing an entire styled span (e.g., `<span style="color:#FF0000;">abc</span>`): Modify the inner text.
     */
    setInlineStyle = ({ toggleMap, deleteMap, mergeMap, upsertMap, replaceMap, hook, moveBookmark, rememberFormat }) => {
        const selection = window.getSelection();
        const activeElement = document.activeElement.tagName;
        if (File.isLocked || "INPUT" === activeElement || "TEXTAREA" === activeElement || !selection.rangeCount) return

        const { range, node, bookmark } = this.utils.getRangy();
        if (!node) return;
        const ele = File.editor.findElemById(node.cid);
        const line = ele.rawText();

        const beforeText = line.substring(0, bookmark.start);
        let innerText = line.substring(bookmark.start, bookmark.end);
        let outerText = innerText;
        let wrapType = "";
        let newBookmark = null;

        const matcher = new RegExp(/^<span\s?(style="(?<styles>.*?)")?>(?<wrapper>.*?)<\/span>$/);
        const suffix = "</span>";

        const innerSelected = () => {
            if (line.substring(bookmark.start, bookmark.end + suffix.length).endsWith(suffix)) {
                const result = beforeText.match(/<span .*?>/g);
                if (!result) return;
                const last = result[result.length - 1];
                if (last && beforeText.endsWith(last)) {
                    return last
                }
            }
        }

        const outerSelected = () => {
            const result = innerText.match(matcher);
            return result && result.groups && result.groups.wrapper;
        }

        const innerRegRet = innerSelected();
        // Scenario c
        if (innerRegRet) {
            wrapType = "inner";
            newBookmark = {
                containerNode: bookmark.containerNode,
                start: bookmark.start - innerRegRet.length,
                end: bookmark.end + suffix.length,
            }
            range.moveToBookmark(newBookmark);
            range.select();
            outerText = line.substring(newBookmark.start, newBookmark.end);
        } else {
            const outerRegRet = outerSelected()
            // Scenario d
            if (outerRegRet) {
                wrapType = "outer";
                innerText = outerRegRet;
            }
        }

        let styleMap = {};
        if (typeof replaceMap !== "undefined") {
            styleMap = replaceMap;
        } else {
            const regexpResult = outerText.match(matcher);
            const styles = regexpResult && regexpResult.groups && regexpResult.groups.styles;
            if (styles) {
                styleMap = this.parseStyleString(styles)
            }
            if (upsertMap) {
                Object.assign(styleMap, upsertMap);
            }
            if (toggleMap) {
                Object.entries(toggleMap).forEach(([key, value]) => {
                    if (styleMap[key] === value) {
                        delete styleMap[key];
                    } else {
                        styleMap[key] = value;
                    }
                })
            }
            if (mergeMap) {
                Object.entries(mergeMap).forEach(([key, value]) => {
                    const origin = styleMap[key];
                    if (origin === value) {
                        delete styleMap[key];
                    } else if (typeof origin === "undefined") {
                        styleMap[key] = value;
                    } else {
                        const set = new Set(origin.split(" "));
                        if (set.has(value)) {
                            set.delete(value);
                        } else {
                            set.add(value);
                        }
                        styleMap[key] = Array.from(set.keys()).join(" ");
                    }
                })
            }
            if (deleteMap) {
                Object.keys(deleteMap).forEach(key => delete styleMap[key]);
            }
        }
        if (hook instanceof Function) {
            hook(styleMap);
        }
        if (rememberFormat) {
            this.formatBrushObj = styleMap;
        }

        const style = Object.entries(styleMap).map(([key, value]) => `${key}:${value};`).join(" ");
        const prefix = (style === "") ? "" : `<span style="${style}">`;
        const content = (style === "") ? innerText : prefix + innerText + suffix;
        this.utils.insertText(null, content, false);

        if (moveBookmark) {
            setTimeout(() => {
                let start = 0;
                // Scenario c
                if (wrapType === "inner") {
                    start = newBookmark.start;
                    // Scenario b or Scenario d
                } else if (wrapType === "outer" || (wrapType === "" && innerText !== "")) {
                    start = bookmark.start;
                    // Scenario a
                } else if (wrapType === "" && innerText === "") {
                    start = beforeText.length;
                }

                const { range, bookmark: bk } = this.utils.getRangy();
                bk.start = start + prefix.length;
                bk.end = bk.start + innerText.length;
                range.moveToBookmark(bk);
                range.select();
            }, 100)
        }
    }

    setMultilineStyle = (ranges, args) => {
        // todo: html element needs add class "md-expand"
        const originMoveBookmark = false
        // const originMoveBookmark = args.moveBookmark;

        this.recordTEXTPosition(ranges);
        const selection = window.getSelection();

        let startBeforeContent, endBeforeContent;
        if (originMoveBookmark) {
            const bookMark = this.recodeBookmark(selection);
            ({ startBeforeContent, endBeforeContent } = bookMark);
        }

        args.moveBookmark = false;
        for (const rangeObj of ranges) {
            this.renewRange(rangeObj);
            const range = document.createRange();
            range.setStart(rangeObj.startContainer, rangeObj.startOffset);
            range.setEnd(rangeObj.endContainer, rangeObj.endOffset);
            selection.removeAllRanges();
            selection.addRange(range);
            this.setInlineStyle(args);
        }

        if (originMoveBookmark) {
            setTimeout(() => {
                const startRange = ranges[0];
                const endRange = ranges[ranges.length - 1];

                startRange.beforeContent = startBeforeContent;
                endRange.beforeContent = endBeforeContent;
                this.renewRange(startRange);
                this.renewRange(endRange);

                const range = document.createRange();
                range.setStartBefore(startRange.startContainer);
                range.setEndBefore(endRange.startContainer);
                selection.removeAllRanges();
                selection.addRange(range);
            }, 100)
        }
    }

    genRanges = () => {
        const range = window.getSelection().getRangeAt(0);
        const nodeList = this.collectNodeInSelection(range);
        return this.splitRanges(nodeList, range)
    }

    recodeBookmark = selection => {
        const range = selection.getRangeAt(0);
        const { endContainer, endOffset, startContainer, startOffset } = range;

        range.setStart(startContainer, 0);
        range.setEnd(startContainer, startOffset);
        selection.removeAllRanges();
        selection.addRange(range);
        const startBeforeContent = range.toString();

        range.setStart(endContainer, 0);
        range.setEnd(endContainer, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
        const endBeforeContent = range.toString();
        return { startBeforeContent, endBeforeContent }
    }

    renewRange = range => {
        const { beforeContent, afterContent, cid } = range;
        const target = this.utils.entities.querySelectorInWrite(`[cid="${cid}"]`);
        const TEXTs = this.getAllTEXT(target);

        let textContent = "";
        for (let i = 0; i < TEXTs.length; i++) {
            let TEXT = TEXTs[i];
            textContent += TEXT.textContent;
            if (textContent === beforeContent) {
                range.startContainer = TEXTs[i + 1];
            }
            if (textContent === afterContent) {
                range.endContainer = TEXTs[i + 1] || TEXT;
                break;
            }
        }
    }

    recordTEXTPosition = ranges => {
        for (const range of ranges) {
            const startTEXT = range.startContainer;
            const endTEXT = range.endContainer;
            const ele = startTEXT.parentElement;
            const target = ele.closest("[cid]");
            const TEXTs = this.getAllTEXT(target);

            for (let i = 0; i < TEXTs.length; i++) {
                const TEXT = TEXTs[i];
                if (TEXT === startTEXT) {
                    range.beforeContent = TEXTs.slice(0, i).map(e => e.textContent).join("");
                    range.cid = target.getAttribute("cid");
                }
                if (TEXT === endTEXT) {
                    range.afterContent = TEXTs.slice(0, i).map(e => e.textContent).join("");
                }
            }
        }
    }

    collectNodeInSelection = range => {
        const { startContainer, endContainer, commonAncestorContainer } = range;

        const nodeList = [];
        const treeWalker = document.createTreeWalker(
            commonAncestorContainer,
            NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT,
            { acceptNode: node => NodeFilter.FILTER_ACCEPT },
        );
        while (treeWalker.currentNode !== startContainer) {
            treeWalker.nextNode();
        }
        while (true) {
            const currentNode = treeWalker.currentNode;
            nodeList.push(currentNode);
            if (currentNode === endContainer) {
                break;
            }
            treeWalker.nextNode();
        }
        return nodeList
    }

    splitRanges = (nodeList, range) => {
        const isText = node => node && node.nodeType === document.TEXT_NODE
        const isElement = node => node && node.nodeType === document.ELEMENT_NODE
        const isSoftBreakElement = node => isElement(node) && node.classList.contains("md-softbreak")
        const isHardBreakElement = node => isElement(node) && node.getAttribute("cid")
        const isBreakElement = node => isSoftBreakElement(node) || isHardBreakElement(node)
        const splitArray = (array, separatorFunc) => {
            return array.reduce((acc, current) => {
                if (separatorFunc(current)) {
                    acc.push([]);
                } else {
                    if (acc.length === 0) {
                        acc.push([]);
                    }
                    acc[acc.length - 1].push(current);
                }
                return acc;
            }, []);
        }

        const isRangeCollapsed = range => range.startContainer === range.endContainer && range.startOffset === range.endOffset
        const isEqualRange = (a, b) => (
            a && b && a.startContainer === b.startContainer && a.startOffset === b.startOffset
            && a.endContainer === b.endContainer && a.endOffset === b.endOffset
        )
        const newRange = (startContainer, startOffset, endContainer, endOffset) => ({
            startContainer, startOffset, endContainer, endOffset
        })

        if (nodeList.length <= 1 || !nodeList.some(isBreakElement)) {
            return [range]
        }

        let filterEmptyText = nodeList.filter((node, idx) => !(isText(node) && isSoftBreakElement(nodeList[idx - 1])));
        const selectLines = splitArray(filterEmptyText, isBreakElement).map(line => line.filter(isText)).filter(ele => ele.length);

        const startLineTexts = selectLines.shift();
        const endLineTexts = selectLines.pop() || startLineTexts;
        const startLineLastText = startLineTexts[startLineTexts.length - 1];
        const endLineFirstText = endLineTexts[0];

        const firstRange = newRange(range.startContainer, range.startOffset, startLineLastText, startLineLastText.length);
        const middleRanges = selectLines.map(line => newRange(line[0], 0, line[line.length - 1], line[line.length - 1].length));
        const ranges = [firstRange, ...middleRanges];
        const isEndWithBreakSymbol = isText(nodeList[nodeList.length - 1]) && isSoftBreakElement(nodeList[nodeList.length - 2]);
        if (!isEndWithBreakSymbol) {
            ranges.push(newRange(endLineFirstText, 0, range.endContainer, range.endOffset));
        }
        return ranges.filter((node, idx) => !isRangeCollapsed(node) && !isEqualRange(ranges[idx - 1], node));
    }

    getAllTEXT = element => {
        const textNodes = [];
        const getTextNodes = node => {
            if (node.nodeType === document.TEXT_NODE) {
                textNodes.push(node);
            } else if (node.nodeType === document.ELEMENT_NODE && (node.classList.contains("md-raw-inline") || node.classList.contains("md-softbreak"))) {
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    getTextNodes(node.childNodes[i]);
                }
            }
        }
        if (element) {
            getTextNodes(element);
        }
        return textNodes
    }

    parseStyleString = styleString => {
        const obj = {}
        styleString.split(";").forEach(s => {
            const [attr, value] = s.trim().split(":")
            if (attr && value) {
                obj[attr] = value
            }
        })
        return obj
    }
}

module.exports = {
    plugin: textStylizePlugin
}
