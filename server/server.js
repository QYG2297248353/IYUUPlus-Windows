const { spawn, exec, execFile } = require('child_process');
const os = require('os');
const path = require('path');
const log = require('electron-log')

function getCmdPath(resourcePath) {
    const arch = os.arch();
    if (arch === 'x64') {
        return path.join(resourcePath, 'run', 'php-8.3.8-x64', 'php.exe');
    } else if (arch === 'ia32') {
        return path.join(resourcePath, 'run', 'php-8.3.8-x86', 'php.exe');
    } else {
        log.info("Unsupported architecture:", arch);
        process.exit(1);
    }
}

let serverProcess = null;

function startServer() {
    let resourcePath = process.resourcesPath;
    if (resourcePath.includes('node_modules')) {
        resourcePath = process.cwd();
    }

    const cmdPath = getCmdPath(resourcePath);
    const batPath = path.join(resourcePath, 'run.bat');
    const workingDirectory = path.resolve(resourcePath);

    const env = { ...process.env };
    const phpDir = path.dirname(cmdPath);
    env.Path = `${phpDir};${env.Path}`;

    // serverProcess = exec(`C:\\Windows\\System32\\cmd.exe /c ${batPath}`, {
    //     cwd: workingDirectory,
    //     env: env,
    //     windowsHide: true
    // }, (error, stdout, stderr) => {
    //     if (error) {
    //         log.error(`[IYUU] 服务启动错误: ${error.message}`);
    //         return;
    //     }
    //     if (stderr) {
    //         log.error(`[IYUU] 服务启动 stderr: ${stderr}`);
    //         return;
    //     }
    //     log.info(`[IYUU] 服务启动成功: ${stdout}`);
    // });

    serverProcess = execFile('cmd.exe', ['/c', batPath], {
        cwd: workingDirectory,
        stdio: 'ignore',
        env: env,
        windowsHide: true
    });

    // serverProcess = spawn('cmd.exe', ['/c', batPath], {
    //     cwd: workingDirectory,
    //     stdio: 'ignore',
    //     env: env,
    //     detached: true,
    //     windowsHide: true
    // });

    serverProcess.unref();

    if (serverProcess.stdout) {
        serverProcess.stdout.setEncoding('utf8');

        serverProcess.stdout.on("data", function (data) {
            log.info("[IYUU] 服务启动成功");
        });
    }

    serverProcess.on("close", function (code) {
        log.info("[IYUU] 服务退出：" + code);
    });
}

function stopServer() {
    if (serverProcess) {
        log.info("Killing server process with PID:", serverProcess.pid);

        try {
            process.kill(-serverProcess.pid, 'SIGTERM');
            log.info("后台服务已关闭...");
            serverProcess = null;
        } catch (err) {
            log.error('Error using process.kill:', err);
            log.info('Falling back to taskkill');
            exec(`taskkill /PID ${serverProcess.pid} /T /F`, (err, stdout, stderr) => {
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
    }, 1000);
}

module.exports = { startServer, stopServer, restartServer };