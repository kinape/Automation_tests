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
        // Força pacote/atividade da ApiDemos para garantir tela inicial previsível no CI
        'appium:appPackage': 'io.appium.android.apis',
        'appium:appActivity': '.ApiDemos',
        // Garante labels em inglês (Views, etc.)
        'appium:language': 'en',
        'appium:locale': 'US',
        'appium:autoGrantPermissions': true,
        'appium:ignoreHiddenApiPolicyError': true,
        // Timeouts e ajustes para estabilizar o boot e comandos ADB (aumentados para CI)
        'appium:adbExecTimeout': 600000,
        'appium:avdLaunchTimeout': 600000,
        'appium:uiautomator2ServerInstallTimeout': 600000,
        'appium:uiautomator2ServerLaunchTimeout': 600000,
        'appium:androidInstallTimeout': 600000,
        'appium:androidDeviceReadyTimeout': 600000,
        'appium:newCommandTimeout': 600,
        'appium:appWaitActivity': '*',
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 20000,
    // Aumenta o timeout de criação de sessão/requests WebDriver para acomodar instalações/lançamentos mais lentos em CI
    connectionRetryTimeout: 600000,
    connectionRetryCount: 5,
    services: [
        ['appium', {
            // Registra saída do Appium em arquivo para publicação no CI
            args: {
                log: path.join(__dirname, '..', 'logs', 'appium.log')
            }
        }]
    ],
    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: path.join(__dirname, '..', 'reports', 'allure-results'),
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000,
        // Em CI, uma nova tentativa pode reduzir flakiness eventual
        retries: process.env.CI ? 1 : 0,
    },
    autoCompileOpts: {
        autoCompile: false,
    },
    // Aguarda o Android estar completamente pronto antes de iniciar os testes
    before: function () {
        const maxWaitMs = 5 * 60 * 1000; // 5 minutos
        const start = Date.now();

        const adbArgsBase = [];
        if (udid) {
            adbArgsBase.push('-s', udid);
        }

        function adbGetprop(prop) {
            const res = cp.spawnSync('adb', [...adbArgsBase, 'shell', 'getprop', prop], { shell: true, encoding: 'utf8' });
            return (res.stdout || '').trim();
        }

        function isBootCompleted() {
            const sysBoot = adbGetprop('sys.boot_completed');
            const devBoot = adbGetprop('dev.bootcomplete');
            const bootAnim = cp.spawnSync('adb', [...adbArgsBase, 'shell', 'getprop', 'init.svc.bootanim'], { shell: true, encoding: 'utf8' });
            const anim = (bootAnim.stdout || '').trim().toLowerCase();
            return (sysBoot === '1' || devBoot === '1') && (anim === 'stopped' || anim === '');
        }

        while (Date.now() - start < maxWaitMs) {
            try {
                // Verifica conectividade com o device
                const getState = cp.spawnSync('adb', [...adbArgsBase, 'get-state'], { shell: true, encoding: 'utf8' });
                const stateOk = (getState.stdout || '').toLowerCase().includes('device');
                if (stateOk && isBootCompleted()) {
                    // Margem de segurança breve após boot
                    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
                    return;
                }
            } catch {}
            // Dorme 2s antes de tentar novamente
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
        }

        // Se chegar aqui, não ficou pronto no tempo esperado; segue e deixa timeouts do Appium/WDIO lidarem
        // (opcionalmente poderíamos lançar erro para falhar mais cedo)
    },
    // Captura screenshot quando um teste falhar para enriquecer o relatório
    afterTest: async function (test, context, { error, result, duration, passed }) {
        if (!passed) {
            try {
                await browser.takeScreenshot();
            } catch (e) {
                // noop
            }
        }
    },
    onPrepare: function () {
        // Garante diretório de logs para salvar appium.log, screenshots, logcat
        const logsDir = path.join(__dirname, '..', 'logs');
        try { fs.mkdirSync(logsDir, { recursive: true }); } catch {}
        const sdkRoot = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');

        if (!sdkRoot || !fs.existsSync(sdkRoot)) {
            throw new Error(
                `Android SDK não encontrado. Verifique as variáveis ANDROID_SDK_ROOT/ANDROID_HOME. ` +
                `Caminho atual resolvido: '${sdkRoot || '(não definido)'}'. ` +
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
                `adb não encontrado. Adicione '${path.join(sdkRoot, 'platform-tools')}' ao PATH ` +
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
                            `AVD '${avdName}' não encontrado. Disponíveis: ${list.join(', ') || '(nenhum)'}.
Defina AVD_NAME para um AVD válido ou conecte um device físico (UDID).`
                        );
                    }
                }
            } catch (e) {
                // Se o comando falhar, aviso
                if (e && e.message) throw e;
            }
        }
    },
    onComplete: function () {
        // Exporta logcat ao final para ajudar no diagnóstico no CI
        try {
            const logsDir = path.join(__dirname, '..', 'logs');
            try { fs.mkdirSync(logsDir, { recursive: true }); } catch {}
            const out = path.join(logsDir, 'logcat.txt');
            const res = cp.spawnSync('adb', ['logcat', '-d'], { shell: true, encoding: 'utf8' });
            if (res && typeof res.stdout === 'string') {
                fs.writeFileSync(out, res.stdout, 'utf8');
            }
        } catch {}
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
