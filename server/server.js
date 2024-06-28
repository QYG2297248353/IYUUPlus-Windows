const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const treeKill = require('tree-kill');

function getCmdPath(resourcePath) {
    const arch = os.arch();
    if (arch === 'x64') {
        return path.join(resourcePath, 'run', 'php-8.3.8-x64', 'php.exe');
    } else if (arch === 'ia32') {
        return path.join(resourcePath, 'run', 'php-8.3.8-x86', 'php.exe');
    } else {
        console.error("Unsupported architecture:", arch);
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
    const args = [path.join(resourcePath, 'iyuu', 'windows.php')];
    const workingDirectory = path.resolve(resourcePath);

    const env = { ...process.env };
    const phpDir = path.dirname(cmdPath);
    env.PATH = `${phpDir}${path.delimiter}${env.PATH}`;

    serverProcess = spawn(cmdPath, args, {
        cwd: workingDirectory,
        stdio: ['inherit', 'pipe', 'inherit'],
        env: env,
        windowsHide: true
    });

    serverProcess.stdout.setEncoding('utf8');

    serverProcess.stdout.on("data", function (data) {
        console.log("[IYUU] 服务启动成功");
    });
    serverProcess.on("close", function (code) {
        console.log("[IYUU] 服务退出：" + code);
    });
}

function stopServer() {
    if (serverProcess) {
        console.log("Killing server process with PID:", serverProcess.pid);
        treeKill(serverProcess.pid, "SIGTERM", function (err) {
            if (err) {
                console.error('Error killing server process:', err);
            } else {
                console.log("后台服务已关闭...");
                serverProcess = null;
            }
        });
    } else {
        console.log("No server process to kill.");
    }
}

function restartServer() {
    stopServer();
    startServer();
}

module.exports = { startServer, stopServer, restartServer };