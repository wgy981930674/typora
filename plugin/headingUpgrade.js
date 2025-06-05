class headingUpgradePlugin extends BasePlugin {
    beforeProcess = () => {
    }

    hotkey = () => []

    init = () => {
        
    }

    init = () => {
    }

    process = () => {

    }



    //执行了
    // call = async (action, meta = {}) => { 
    call = (anchorNode) => {        
      console.log("标题节点是否传递成功 anchorNode %o" , anchorNode )


    }



}

module.exports = {
    plugin: headingUpgradePlugin,
}
