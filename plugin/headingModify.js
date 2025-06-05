class headingModifyPlugin extends BasePlugin {
    hotkey = () => [
    ]

    init = () => {
        const notRecommended = this.i18n.t("actHint.notRecommended")
        const defaultDoc = this.i18n.t("actHint.defaultDoc")

        this._showWarnDialog = true
        this.staticActions = this.i18n.fillActions([
            { act_value: "increase_headers_level", act_hotkey: this.config.HOTKEY_INCREASE_HEADERS_LEVEL, act_hint: defaultDoc },
            { act_value: "decrease_headers_level", act_hotkey: this.config.HOTKEY_DECREASE_HEADERS_LEVEL, act_hint: defaultDoc },
            { act_value: "copy_heading_path" }, //标题路径 [](#标题)
            { act_value: "copy_relative_path" }, //相对标题路径 [](#文件相对路径#标题)
            { act_value: "copy_absolute_path" }, //绝对标题路径 [](#文件绝对路径#标题)
            { act_value: "insert_heading" }, //在标题尾部新起一行
            { act_value: "delete_heading" }, //选择标题内容，删除或者复制

            { act_value: "heading_uuid" }, //替换成UUID标题 <a name="{uuid}">标题</a>
            { act_value: "all_heading_uuid" }, //所有标题替换为UUID标题
        ])
    }

    getDynamicActions = (anchorNode, meta) => {
        //！！！比如打开文件时光标不在编辑区，此时右键菜单-展开三级菜单，有时Range相关函数可能出错！！点击激活一次编辑区能解决，但是如果光标在类似代码块等元素内，会再次出错。所以用了exeCommand光标跳转来解决，应该有更好的解决办法
        File.editor.undo.exeCommand({ type: "cursor", id: anchorNode.getAttribute("cid"), start: 0 }) 
        meta.range = window.getSelection().getRangeAt(0) 

        meta.copyAnchor = anchorNode.closest("#write > [cid]")
        meta.insertAnchor = anchorNode.closest('#write > p[mdtype="paragraph"]')
        return null
    }

    dynamicCall = action => this.utils.updateAndCallPluginDynamicAction(this.fixedName, action)

    call = async (action, meta = {}) => {
        const funcMap = {
            increase_headers_level: () => this.changeHeadersLevel(meta.copyAnchor,true),
            decrease_headers_level: () => this.changeHeadersLevel(meta.copyAnchor,false),
            copy_heading_path: () => this.copyHeadingPath(meta.copyAnchor),
            copy_relative_path: () => this.copyRelativePath(meta.copyAnchor),
            copy_absolute_path: () => this.copyAbsolutePath(meta.copyAnchor),
            insert_heading: () => this.insertHeading(meta.copyAnchor),
            delete_heading: () => this.deleteHeading(meta.copyAnchor),

            heading_uuid: () => this.headingUUID(meta.copyAnchor),
            all_heading_uuid: () => this.allHeadingUUID(meta.copyAnchor),
        }
        const func = funcMap[action]
        if (!func) return

        const success = await func()
        if (success !== false) {
            const msg = this.i18n._t("global", "success")
            this.utils.notification.show(msg)
        }
    }

    insertHeading = (copyAnchor) => {
        const getHeader = (cid) => {
            const { headers = [] } = File.editor.nodeMap.toc
            const start = headers.findIndex(h => h.cid === cid)
            if (start === -1) return

            const header = headers[start]
            if (!header.attributes) return

            let end = start + 1
            const depth = header.attributes.depth
            while (end < headers.length) {
                const { attributes } = headers[end]
                const _depth = attributes && attributes.depth
                if (_depth && _depth <= depth) {
                    break
                }
                end++
            }

            if(headers.length === end) {
                return File.editor.findElemById(headers[end-1].id)[0].parentElement.lastElementChild
            }else{
                return File.editor.findElemById(headers[end].id)[0].previousElementSibling
            }  
        }

        if( !copyAnchor ) return

        const tail = getHeader( copyAnchor.getAttribute("cid") )
        const range = File.editor.selection.getRangy(); 
        range.setStart(tail, 0)
        range.setEnd(tail, 0) 
        File.editor.selection.setRange(range, true)
        File.editor.UserOp.insertParagraph(false)  
        this.utils.scrollByCid( tail.nextElementSibling.getAttribute("cid") )     
        return tail
    }

    
    deleteHeading = (copyAnchor) => {
        if( !copyAnchor ) return
		//选择标题及子标题内容后按del或者backspace删除，当最后一个元素为代码块、引用等元素时，是删除不干净的。所以先加一个段落在标题内容末尾，再选择内容就可以删除干净了
        const tail = this.insertHeading(copyAnchor)
        const range = File.editor.selection.getRangy(); 
        range.setStartBefore(copyAnchor)
        range.setEndAfter(tail)
        File.editor.selection.setRange(range, true);
    }
    
    getJump = (copyAnchor) => {
        if( !copyAnchor ) return
        const textContent = copyAnchor.textContent.trim()
        const aTag = Array.from(copyAnchor.querySelectorAll('a')) 
        const idx = aTag.findIndex( a => a.getAttribute('name') ) 
        return idx === -1 ? textContent : aTag[idx].getAttribute('name')
    }

    copyHeadingPath = async (copyAnchor) => {
        if( !copyAnchor ) return
        const jump = this.getJump(copyAnchor)
        const textContent = copyAnchor.textContent.trim()
        const fullPath = `[${textContent}](#${jump})`
        await navigator.clipboard.writeText(fullPath)
    }

    copyRelativePath = async (copyAnchor) => {
        if( !copyAnchor ) return
        const filePath = this.utils.getFilePath()
        const folder = this.utils.getMountFolder()
        if( !filePath && !folder ) return
        
        const textContent = copyAnchor.textContent.trim()
        const startIndex = filePath.indexOf(folder+"\\");
        if (startIndex === -1) return
        const result = filePath.substring(startIndex + folder.length);

        const jump = this.getJump(copyAnchor)
        const fullPath = `[${textContent}](.${result}#${jump})`
        await navigator.clipboard.writeText(fullPath)
    }

    copyAbsolutePath = async (copyAnchor) => {
        if( !copyAnchor ) return
        const textContent = copyAnchor.textContent.trim()
        const filePath = this.utils.getFilePath() || "Untitled"
        const jump = this.getJump(copyAnchor)
        const fullPath = `[${textContent}](${filePath}#${jump})`
        console.log("==headingModify.js copyAbsolutePath fullPath %o" ,fullPath )
        await navigator.clipboard.writeText(fullPath)
    }

    //替换为uuid标题，未涉及markdown解析应该是安全的。 但是删除会设计markdown解析，有点麻烦。editor.MarkParser.parseInline 函数解析节点内容，其中关键函数搜索源码(ai逆向解析可以解析,但有点长)： q.prototype.output = function(e, s, t, n, l) ，逆向出来就可以自己正向解析了，为所欲为
    headingUUID = (copyAnchor) => {
        if( !copyAnchor || copyAnchor.querySelectorAll('a').length > 0 ) return   //存在a标签

        const cid = copyAnchor.getAttribute("cid")
        const node = File.editor.getNode( cid )        
        let nodeJson = node.storeToJson()
        nodeJson.content.text = `<a name="${this.utils.randomString()}">${nodeJson.content.text.trim()}</a>` 

        const undoCommand = File.editor.undo.UndoManager.makeEmptyCommand()
        File.editor.undo.register(undoCommand)
        undoCommand.undo.push( File.editor.undo.buildReplaceUndo(node) ) //未改动的node
        const result = File.editor.undo.exeCommand( {
            type: "replace",
            id: node.id,
            json: nodeJson
        } ); 
        undoCommand.redo.push( File.editor.undo.buildReplaceUndo(node) ) //改动过的node
        this.utils.scrollByCid( copyAnchor.getAttribute("cid") )

    }

    //替换所有为uuid标题
    allHeadingUUID = (copyAnchor ) => {
        const { headers = [] } = File.editor.nodeMap.toc  
        if(headers.length === 0) return
        const undoCommand = File.editor.undo.UndoManager.makeEmptyCommand()
        File.editor.undo.register(undoCommand)            

        headers.forEach( node => {
            const copyAnchor = File.editor.findElemById( node.id )[0]
            if( copyAnchor && copyAnchor.querySelectorAll('a').length === 0 ) {//不存在a标签
                let nodeJson = node.storeToJson()
                nodeJson.content.text = `<a name="${this.utils.randomString()}">${nodeJson.content.text.trim()}</a>` 

                undoCommand.undo.push( File.editor.undo.buildReplaceUndo(node) ) //未改动的node
                const result = File.editor.undo.exeCommand({
                    type: "replace",
                    id: node.id,
                    json: nodeJson
                });
                undoCommand.redo.push( File.editor.undo.buildReplaceUndo(node) ) //改动过的node
            }   
        })
               
    }            


    changeHeadersLevel = (copyAnchor, incr) => {
        const _getTargetHeaders = (cid) => {
            const {headers} = File.editor.nodeMap.toc   

            const start = headers.findIndex(h => h.cid === cid)
            if (start === -1) return

            const header = headers[start]
            if (!header.attributes) return

            const subHeaders = []
            subHeaders.push( headers[start] )
            let end = start + 1
            const depth = header.attributes.depth
            while (end < headers.length) {
                const { attributes } = headers[end]
                const _depth = attributes && attributes.depth
                if (_depth && _depth <= depth) {
                    break
                }
                subHeaders.push( headers[end] )
                end ++
            }

            return subHeaders
        }

        const _changeHeaderLevel = (node) => {
            const nodeType = node.get("type")
            if (incr && nodeType === "paragraph") {
                File.editor.stylize.changeBlock("header6", node)
                return
            }
            if (nodeType === "heading") {
                const newLevel = +node.get("depth") + (incr ? -1 : 1)
                if (newLevel === 7) {
                    File.editor.stylize.changeBlock("paragraph", node)
                } else if (0 < newLevel && newLevel <= 6) {
                    File.editor.stylize.changeBlock(`header${newLevel}`, node)
                }
            }
        }

        _getTargetHeaders( copyAnchor.getAttribute("cid") ).forEach(_changeHeaderLevel)
    }

}

module.exports = {
    plugin: headingModifyPlugin,
}
