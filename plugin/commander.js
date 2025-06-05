/**
 * Implementing this plugin requires three types of compatibility:
 * 1. Abstracting operating system differences to support Windows and Linux.
 * 2. Abstracting shell differences to support cmd, WSL, and bash, including nested shell calls.
 * 3. Abstracting parameter differences, where cmd uses %VAR% and bash uses $VAR.
 */
class commanderPlugin extends BasePlugin {
    beforeProcess = () => {
        this.SHELL = { CMD_BASH: "cmd/bash", POWER_SHELL: "powershell", GIT_BASH: "gitbash", WSL: "wsl" }
        const shellList = Object.values(this.SHELL)
        this.builtin = this.config.BUILTIN.filter(e => !e.disable && e.shell && shellList.includes(e.shell))
        if (!File.isWin) {
            this.builtin = this.builtin.filter(e => e.shell !== this.SHELL.CMD_BASH)
        }
    }

    styleTemplate = () => true

    html = () => {
        const runText = this.i18n.t("runCommand")
        const envText = this.i18n.t("envInfo")
        const { CMD_BASH, POWER_SHELL, GIT_BASH, WSL } = this.SHELL
        const genShell = (shell, text) => `<option value="${shell}">${text}</option>`
        const shells = [genShell(CMD_BASH, "CMD/Bash")]
        if (File.isWin) {
            shells.push(
                genShell(POWER_SHELL, "PowerShell"),
                genShell(GIT_BASH, "Git Bash"),
                genShell(WSL, "WSL"),
            )
        }
        const builtin = this.builtin.map(e => `<option data-shell="${e.shell}" value="${this.utils.escape(e.cmd)}">${e.name}</option>`)
        return `
            <div id="plugin-commander" class="plugin-common-modal plugin-common-hidden"> 
                <form id="plugin-commander-form">
                    <div class="plugin-commander-input-wrap">
                        <div class="ion-ios7-play plugin-commander-commit plugin-common-hidden" ty-hint="${runText}"></div>
                        <input type="text" class="plugin-commander-input" title="${envText}">
                    </div>
                    <select class="plugin-commander-shell">${shells.join("")}</select>
                    <select class="plugin-commander-builtin">${builtin.join("")}</select>
                </form>
                <div class="plugin-commander-output plugin-common-hidden"><pre></pre></div>
            </div>
        `
    }

    hotkey = () => {
        const defaultHotkey = { hotkey: this.config.HOTKEY, callback: this.call }
        const customHotkeys = this.builtin
            .filter(({ hotkey, cmd }) => hotkey && cmd)
            .map(({ hotkey, cmd, shell }) => ({ hotkey, callback: () => this.quickExecute(cmd, shell) }))
        return [defaultHotkey, ...customHotkeys]
    }

    init = () => {
        this.entities = {
            modal: document.getElementById("plugin-commander"),
            form: document.querySelector("#plugin-commander-form"),
            input: document.querySelector("#plugin-commander-form .plugin-commander-input"),
            shellSelect: document.querySelector("#plugin-commander-form .plugin-commander-shell"),
            builtinSelect: document.querySelector("#plugin-commander-form .plugin-commander-builtin"),
            commit: document.querySelector("#plugin-commander-form .plugin-commander-commit"),
            output: document.querySelector(".plugin-commander-output"),
            pre: document.querySelector(".plugin-commander-output pre"),
        }

        this.act_value_prefix = "call_builtin@"
        const defaultAct = { act_name: this.i18n.t("act.toggle_modal"), act_value: "toggle_modal", act_hotkey: this.config.HOTKEY }
        const customActs = this.builtin
            .filter(a => a.name && a.cmd)
            .map(a => ({ act_name: a.name, act_value: this.act_value_prefix + a.name, act_hotkey: a.hotkey }))
        this.staticActions = [defaultAct, ...customActs]
    }

    process = () => {
        this.entities.commit.addEventListener("click", () => this.commitExecute());
        this.entities.shellSelect.addEventListener("change", () => this.entities.input.focus());
        this.entities.builtinSelect.addEventListener("change", ev => {
            const option = ev.target.selectedOptions[0];
            if (!option) return;
            this.entities.shellSelect.value = option.dataset.shell;
            this.entities.input.value = option.value;
            this.entities.input.dispatchEvent(new Event("input"));
            this.entities.input.focus();
        })
        this.entities.input.addEventListener("input", ev => {
            const hasCMD = ev.target.value.trim();
            this.utils.toggleVisible(this.entities.commit, !hasCMD);
            if (!hasCMD) {
                this.entities.builtinSelect.value = "";
            }
        })
        this.entities.form.addEventListener("submit", ev => {
            ev.preventDefault();
            this.commitExecute();
        })
        this.entities.form.addEventListener("keydown", ev => {
            const wantHide = ev.key === "Escape" || (ev.key === "Backspace" && this.config.BACKSPACE_TO_HIDE && !this.entities.input.value)
            if (wantHide) {
                this.utils.hide(this.entities.modal)
            }
        })
        if (this.config.ALLOW_DRAG) {
            this.utils.dragFixedModal(this.entities.input, this.entities.modal);
        }
    }

    _convertPath = (path, shell) => {
        if (File.isWin) {
            if (shell === this.SHELL.WSL) {
                return "/mnt" + this.utils.windowsPathToUnix(path)
            } else if (shell === this.SHELL.GIT_BASH) {
                return this.utils.windowsPathToUnix(path)
            }
        }
        return path
    }
    _getFile = shell => this._convertPath(this.utils.getFilePath(), shell);
    _getFolder = shell => this._convertPath(this.utils.getCurrentDirPath(), shell);
    _getMountFolder = shell => this._convertPath(this.utils.getMountFolder(), shell);

    // TODO: Too hacky. Reversing shell is better.
    _getCommand = (cmd, shell) => {
        const replaceArgs = (cmd, shell) => {
            const replacements = { f: this._getFile(shell), d: this._getFolder(shell), m: this._getMountFolder(shell) }
            return cmd.replace(/\$([fdm])\b/g, match => `"${replacements[match.slice(1)]}"`)
        }
        const getShellCommand = shell => {
            switch (shell) {
                case this.SHELL.GIT_BASH:
                    return `bash.exe -c`
                case this.SHELL.POWER_SHELL:
                    return `powershell /C`
                case this.SHELL.WSL:
                    return `wsl.exe -e bash -c`
                default:
                    return File.isWin ? "cmd /C" : "bash -c"
            }
        }
        const prefix = File.isWin ? "chcp 65001 |" : ""
        const nestCommand = replaceArgs(cmd, shell)
        const shellCommand = getShellCommand(shell)
        return `${prefix} ${shellCommand} "${nestCommand}"`
    }

    _refreshModal = (cmd, shell) => {
        this.entities.input.value = cmd;
        this.entities.input.dispatchEvent(new Event("input"));
        this.entities.shellSelect.value = shell;
        this._showResult("", false, false);
    }

    _showResult = (result, showModal = true, error = false) => {
        if (showModal) {
            this.utils.show(this.entities.modal);
        }
        this.utils.show(this.entities.output);
        this.entities.pre.textContent = result;
        this.entities.pre.classList.toggle("error", error);
    }
    _showStdout = result => this._showResult(result, true, false)
    _showStderr = result => this._showResult(result, true, true)

    // Why not use shell options? A: Cannot support WSL.
    // Why not use env options? A: For compatibility. cmd uses %VAR%, bash uses $VAR. Commands may also span multiple shell layers.
    _exec = ({ cmd, shell, options = {}, resolve = console.log, reject = console.error, callback = null }) => {
        const command = this._getCommand(cmd, shell);
        const options_ = { encoding: "utf8", cwd: this._getFolder(), ...options }
        const callback_ = (err, stdout, stderr) => {
            const hasError = err || stderr.length > 0
            const errorMessage = hasError ? (err || stderr.toString()) : null
            if (reject && hasError) {
                reject(errorMessage)
            } else if (resolve && !hasError) {
                resolve(stdout)
            }
            if (callback) {
                callback(err, stdout, stderr)
            }
        }
        this._refreshModal(cmd, shell)
        this.utils.Package.ChildProcess.exec(command, options_, callback_)
    }
    _spawn = ({ cmd, shell, options = {}, callback = null }) => {
        const command = this._getCommand(cmd, shell);
        const options_ = { encoding: "utf8", cwd: this._getFolder(), shell: true, ...options };
        const resolve = data => this.entities.pre.textContent += data.toString();
        const reject = data => {
            this.entities.pre.textContent += data.toString();
            this.entities.pre.classList.add("error");
        }
        const callback_ = code => callback && callback(code);

        this._refreshModal(cmd, shell);
        const child = this.utils.Package.ChildProcess.spawn(command, options_);
        child.stdout.on("data", resolve);
        child.stderr.on("data", reject);
        child.on("close", callback_);
    }

    echoExec = (cmd, shell, options = {}, callback = null) => this._spawn({ cmd, shell, options, callback });
    silentExec = (cmd, shell, options = {}, callback = null) => this._exec({ cmd, shell, options, callback });
    errorExec = (cmd, shell, options = {}, callback = null) => this._exec({ cmd, shell, options, callback, reject: this._showStderr });
    alwaysExec = (cmd, shell, options = {}, callback = null) => this._exec({ cmd, shell, options, callback, resolve: this._showStdout, reject: this._showStderr });

    execute = (type, cmd, shell, options = {}, callback = null) => {
        const execFunctions = { always: this.alwaysExec, error: this.errorExec, silent: this.silentExec, echo: this.echoExec };
        const execFunction = execFunctions[type] || execFunctions.echo;
        return execFunction(cmd, shell, options, callback);
    };
    quickExecute = (cmd, shell) => this.execute(this.config.QUICK_RUN_DISPLAY, cmd, shell)
    commitExecute = () => {
        const cmd = this.entities.input.value;
        if (!cmd) {
            this._showStderr("command is empty");
        } else {
            const option = this.entities.shellSelect.selectedOptions[0];
            if (option) {
                this.execute(this.config.COMMIT_RUN_DISPLAY, cmd, option.value)
            }
        }
    }

    toggleModal = () => {
        const { modal, input } = this.entities;
        this.utils.toggleVisible(modal);
        if (this.utils.isShow(modal)) {
            input.select();
        }
    }

    call = (action = "toggle_modal") => {
        if (action === "toggle_modal") {
            this.toggleModal()
        } else if (action.startsWith(this.act_value_prefix)) {
            const name = action.slice(this.act_value_prefix.length)
            const builtin = this.builtin.find(c => c.name === name)
            if (builtin) {
                this.quickExecute(builtin.cmd, builtin.shell)
            }
        }
    }
}

module.exports = {
    plugin: commanderPlugin
}
