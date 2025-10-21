# Testes Mobile (WebdriverIO + Appium)
[![Autor: Rogerio Melo Kinape](https://img.shields.io/badge/autor-Rogerio%20Melo%20Kinape-blue)](#autor)

Este diretório contém a suíte E2E mobile usando WebdriverIO 8 com Appium (Android).

## Estrutura

- `mobile/config/wdio.conf.js`: configuração do runner (capabilities, timeouts, validações).
- `mobile/test/pageobjects`: Page Objects (ex.: `login.page.js`, `home.page.js`).
- `mobile/test/specs`: Casos de teste (ex.: `login.spec.js`).
- `mobile/app`: APK sob teste (ex.: `ApiDemos-debug.apk`).
- `mobile/scripts`: utilitários PowerShell para AVD (`start-avd.ps1`) e setup.

## Pré-requisitos

- Node.js 20+ e Java 17 (JDK Temurin recomendado).
- Android SDK configurado e acessível via `ANDROID_HOME`/`ANDROID_SDK_ROOT`.
- Ferramentas Android no `PATH` (`platform-tools`, `emulator`, `tools`).
- Appium 2 (instalado via `npm` e gerenciado pelo serviço do WDIO).

## Como Executar (Windows)

- Instale dependências na raiz do projeto:

  ```bash
  npm install
  ```

- Inicie um emulador Android em modo headless e execute os testes:

  ```bash
  npm run test:mobile:with-avd
  ```

- Executar apenas os testes (assumindo device/emulador já ativo):

  ```bash
  npm run test:mobile
  ```

## Relatório (Allure)

- Após a execução dos testes, gere o relatório Allure:

  ```bash
  npm run allure:generate:mobile
  ```

- Para abrir o relatório localmente:

  ```bash
  npm run allure:open:mobile
  ```

- Em CI (GitHub Actions), o job `appium-mobile-test` gera e publica o artefato
  `mobile-allure-report` automaticamente.

## Variáveis de Ambiente Suportadas

As capacidades podem ser ajustadas sem editar o código (ver `mobile/config/wdio.conf.js`):

- `AVD_NAME` ou `ANDROID_AVD`: nome do AVD a iniciar/usar.
- `UDID`: UDID de um device físico conectado (adb).
- `DEVICE_NAME`: rótulo do device (ex.: `Pixel 6`).
- `APP_PATH`: caminho para o `.apk` (absoluto ou relativo).

Exemplo (Windows PowerShell):

```powershell
$env:APP_PATH="C:\\apps\\MeuApp.apk"; $env:AVD_NAME="Pixel_6_API_34"; npm run test:mobile:win
```

## Notas de Execução

- O `wdio.conf.js` valida se o SDK e `adb` estão acessíveis antes de iniciar.
- O APK é checado quanto à assinatura ZIP válida para evitar "Invalid file" no Appium.
- Em CI (GitHub Actions) o emulador é gerenciado por `reactivecircus/android-emulator-runner` e o Appium é iniciado pelo serviço do WDIO.
