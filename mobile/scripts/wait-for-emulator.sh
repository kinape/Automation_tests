#!/usr/bin/env bash
set -euo pipefail

# Wait for Android emulator to be fully booted and online.
# Optional arg1: timeout in seconds (default 300)

TIMEOUT_SECONDS="${1:-300}"

export ANDROID_HOME="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
export PATH="$PATH:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/emulator"

start_time=$(date +%s)

echo "Waiting for ADB device..."
adb -e wait-for-device || adb wait-for-device || true

while true; do
  # If device shows as offline, restart ADB to recover
  if adb devices | grep -q 'offline'; then
    echo "Device is offline, restarting ADB server"
    adb kill-server || true
    sleep 1
    adb start-server || true
    sleep 5
  fi

  # Target explicitly the emulator instance (-e)
  boot_completed=$(adb -e shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)
  dev_boot=$(adb -e shell getprop dev.bootcomplete 2>/dev/null | tr -d '\r' || true)
  boot_anim=$(adb -e shell getprop init.svc.bootanim 2>/dev/null | tr -d '\r' | tr '[:upper:]' '[:lower:]' || true)

  if { [ "$boot_completed" = "1" ] || [ "$dev_boot" = "1" ]; } \
     && { [ "$boot_anim" = "stopped" ] || [ -z "${boot_anim}" ]; }; then
    echo "Emulator is ready."
    exit 0
  fi

  now=$(date +%s)
  elapsed=$(( now - start_time ))
  if [ "$elapsed" -ge "$TIMEOUT_SECONDS" ]; then
    echo "Timeout waiting for emulator (${TIMEOUT_SECONDS}s)" >&2
    exit 1
  fi

  echo "Waiting for emulator to start... (boot_completed=$boot_completed, anim=$boot_anim)"
  sleep 5
done
