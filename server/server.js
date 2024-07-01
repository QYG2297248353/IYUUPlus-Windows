const { spawn, exec, execFile } = require('child_process');
const os = require('os');
const path = require('path');
const log = require('electron-log')
const mainWin = require('../windows/app')

let serverProcess = null;

function getPhpPath(resourcePath) {
    const arch = os.arch();
    if (arch === 'x64') {
        return path.join(resourcePath, 'run', 'php-8.3.8-x64');
    } else if (arch === 'ia32') {
        return path.join(resourcePath, 'run', 'php-8.3.8-x86');
    } else {
        log.info("Unsupported architecture:", arch);
        process.exit(1);
    }
}

function startServer() {
    if (!serverProcess) {
        let resourcePath = process.resourcesPath;
        if (resourcePath.includes('node_modules')) {
            resourcePath = process.cwd();
        }

        const env = { ...process.env };
        const phpDir = getPhpPath(resourcePath);
        env.Path = `${phpDir};${env.Path}`;

        const workingDir = path.resolve(path.join(resourcePath, 'iyuu'));

        log.info(`[IYUU] 工作目录: ${workingDir}`);

        serverProcess = execFile('cmd', ['/c', 'windows.bat'], {
            cwd: workingDir,
            env: env,
            killSignal: 'SIGTERM',
            windowsHide: true,
        }, (error, stdout, stderr) => {
            if (error) {
                log.error(`[IYUU] 服务启动错误: ${error.message}`);
            } else {
                log.error(`[IYUU] 服务启动 stderr: ${stderr}`);
                log.info(`[IYUU] 服务启动成功: ${stdout}`);
            }
        });

        // serverProcess = spawn('cmd', ['/c', 'windows.bat'], {
        //     cwd: workingDir,
        //     stdio: 'pipe',
        //     env: env,
        //     detached: true,
        //     windowsHide: true
        // });

        serverProcess.unref();

        if (serverProcess.stdout) {
            serverProcess.stdout.on('data', (data) => {
                log.info(`[IYUU] ${data}`);
            });

            serverProcess.stderr.on('data', (data) => {
                log.error(`[IYUU] ${data}`);
            });
        }

        serverProcess.on('error', (err) => {
            log.error(`[IYUU] 服务启动错误: ${err.message}`);
        });

        serverProcess.on("close", function (code) {
            log.info("[IYUU] 服务退出：" + code);
        });
    }
}

function stopServer() {
    if (serverProcess) {
        mainWin.hideWindows()
        log.info("Killing server process with PID:", serverProcess.pid);
        try {
            process.kill(-serverProcess.pid, 'SIGTERM');
            log.info("后台服务已关闭...");
            serverProcess = null;
        } catch (err) {
            log.error('Error using process.kill:', err);
            exec(`taskkill /PID ${serverProcess.pid} /T /F`, (err, _stdout, _stderr) => {
                if (err) {
                    log.error('Error using taskkill:', err);
                } else {
                    log.info("后台服务已关闭...");
                    serverProcess = null;
                }
            });
        }
    } else {
        log.info("No server process to kill.");
    }
}

function restartServer() {
    stopServer();
    setTimeout(() => {
        startServer();
        setTimeout(() => {
            mainWin.showWindows()
        }, 2000)
    }, 1000);
}

module.exports = { startServer, stopServer, restartServer };