const path = require('path');
const fs = require('fs');
const cp = require('child_process');

// Variáveis de ambiente
const avdName = process.env.AVD_NAME || process.env.ANDROID_AVD;
const udid = process.env.UDID;
const deviceNameEnv = process.env.DEVICE_NAME;
const appPathEnv = process.env.APP_PATH;

exports.config = {
    runner: 'local',
    port: 4723,
    specs: [
        path.join(__dirname, '..', 'test', 'specs', '**', '*.js')
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        'appium:platformName': 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': deviceNameEnv || 'Android Emulator',
        'appium:app': appPathEnv ? path.resolve(appPathEnv) : path.join(__dirname, '..', 'app', 'ApiDemos-debug.apk'),
        'appium:autoGrantPermissions': true,
        // Timeouts e ajustes para estabilizar o boot e comandos ADB
        'appium:adbExecTimeout': 240000,
        'appium:avdLaunchTimeout': 180000,
        'appium:uiautomator2ServerInstallTimeout': 180000,
        'appium:uiautomator2ServerLaunchTimeout': 180000,
        'appium:newCommandTimeout': 120,
        'appium:appWaitActivity': '*',
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    // Aumenta o timeout de criação de sessão/requests WebDriver para acomodar instalações/lançamentos mais lentos em CI
    connectionRetryTimeout: 300000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
    autoCompileOpts: {
        autoCompile: false,
    },
    onPrepare: function () {
        const sdkRoot = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');

        if (!sdkRoot || !fs.existsSync(sdkRoot)) {
            throw new Error(
                `Android SDK nǜo encontrado. Verifique as variǭveis ANDROID_SDK_ROOT/ANDROID_HOME. ` +
                `Caminho atual resolvido: '${sdkRoot || '(nǜo definido)'}'. ` +
                `Abra o Android Studio e copie o caminho do SDK ou execute npx appium-doctor --android.`
            );
        }

        const tryAdb = (cmd) => {
            try {
                const res = cp.spawnSync(cmd, ['version'], { shell: true, stdio: 'ignore' });
                return res && res.status === 0;
            } catch {
                return false;
            }
        };

        const adbInPath = tryAdb('adb');
        const adbFullPath = path.join(sdkRoot, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');
        const adbExists = fs.existsSync(adbFullPath);

        if (!adbInPath && !adbExists) {
            throw new Error(
                `adb nǜo encontrado. Adicione '${path.join(sdkRoot, 'platform-tools')}' ao PATH ` +
                `ou instale o pacote 'platform-tools' via SDK Manager. ` +
                `SDK: '${sdkRoot}'.`
            );
        }

        try {
            const appCandidate = exports.config.capabilities[0]['appium:app'];
            if (!appCandidate) {
                throw new Error('APK path not defined. Set APP_PATH or place the file at mobile/app/ApiDemos-debug.apk.');
            }

            if (!fs.existsSync(appCandidate)) {
                throw new Error(`APK not found at '${appCandidate}'. Set APP_PATH to a valid .apk or place it at mobile/app/ApiDemos-debug.apk.`);
            }

            const stat = fs.statSync(appCandidate);
            const fd = fs.openSync(appCandidate, 'r');
            const header = Buffer.alloc(32);
            fs.readSync(fd, header, 0, header.length, 0);
            fs.closeSync(fd);

            const isZip = header[0] === 0x50 && header[1] === 0x4B; // 'PK'
            const headStr = header.toString('utf8').toLowerCase();
            const looksHtml = headStr.includes('<!doctype') || headStr.includes('<html');

            if (!isZip) {
                const hint = looksHtml
                    ? 'File appears to be HTML (likely a downloaded web page).'
                    : 'File does not have a valid ZIP/APK signature.';
                throw new Error(`Invalid APK at '${appCandidate}' (size ${stat.size} bytes). ${hint} Replace with a valid .apk or set APP_PATH to a correct one.`);
            }

            if (stat.size < 500000) {
                // eslint-disable-next-line no-console
                console.warn(`Warning: APK size seems small (${stat.size} bytes). If startup fails, replace it with a proper build.`);
            }
        } catch (e) {
            if (e && e.code === 'ENOENT') {
                throw new Error('APK not found. Set APP_PATH to an existing .apk or place it at mobile/app/ApiDemos-debug.apk.');
            }
            throw e;
        }

        if (avdName) {
            // Valida AVD
            try {
                const emu = cp.spawnSync('emulator', ['-list-avds'], { shell: true, encoding: 'utf8' });
                if (emu.status === 0 && emu.stdout) {
                    const list = emu.stdout.split(/\r?\n/).filter(Boolean);
                    if (!list.includes(avdName)) {
                        throw new Error(
                            `AVD '${avdName}' nǜo encontrado. Dispon��veis: ${list.join(', ') || '(nenhum)'}.
Defina AVD_NAME para um AVD vǭlido ou conecte um device f��sico (UDID).`
                        );
                    }
                }
            } catch (e) {
                // Se o comando falhar, aviso;s
                if (e && e.message) throw e;
            }
        }
    },
};

// Define AVD automaticamente
if (avdName) {
    exports.config.capabilities[0]['appium:avd'] = avdName;
}

// Define UDID do device físico
if (udid) {
    exports.config.capabilities[0]['appium:udid'] = udid;
}
