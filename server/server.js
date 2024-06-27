const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const treeKill = require('tree-kill');

function getCmdPath() {
    const arch = os.arch();
    if (arch === 'x64') {
        return "./run/php-8.3.8-x64/php.exe";
    } else if (arch === 'ia32') {
        return "./run/php-8.3.8-x86/php.exe";
    } else {
        console.error("Unsupported architecture:", arch);
        process.exit(1);
    }
}

let serverProcess = null;

function startServer() {
    const cmdPath = getCmdPath();
    const args = ['./iyuu/windows.php'];
    const workingDirectory = path.resolve(__dirname, '..');

    serverProcess = spawn(cmdPath, args, {
        cwd: workingDirectory,
        stdio: ['inherit', 'pipe', 'inherit']
    });

    serverProcess.stdout.setEncoding('utf8');

    serverProcess.stdout.on("data", function (data) {
        console.log("启动服务器成功！ stdout:" + data);
    });
    serverProcess.on("close", function (code) {
        console.log("out code:" + code);
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

module.exports = { startServer, stopServer };