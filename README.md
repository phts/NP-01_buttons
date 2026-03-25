# PHTS NP-01: buttons

Event handlers of buttons on a front panel of [PHTS NP-01].

:warning: Some of those commands also used by [IR controller].

## Current mappings

![](https://image.easyeda.com/pullimage/P1ExBecBeSxIv2muLd6SAAzfSfF7M1A6Ks2ER6qd.png)

<table>
  <thead><tr>
    <th rowspan=2>Name</th>
    <th rowspan=2>Short press</th>
    <th colspan=2>Long press</th>
  </tr>
  <tr>
    <th>While playing</th>
    <th>While paused</th>
  </tr><thead>
  <tbody>
    <tr>
      <td><code>SHUTDOWN</code></td>
      <td>Gracefully shutdown the device</td>
      <td colspan=2>Reboot the device</td>
    </tr>
    <tr>
      <td><code>□</code></td>
      <td>Toggle screen modes: "Track info", "VU meter", "Screensaver"</td>
      <td colspan=2>
      <table>
      <tr><th colspan=3>Current screen mode</th></tr>
      <tr><th>Track info</th><th>VU meter</th><th>Screensaver</th></tr>
      <tr><td colspan=2>Toggle repeat/random track mode</td><td>Toggle background image</td></tr>
      </table>
      </td>
    </tr>
    <tr>
      <td><code>▶ / ⏸</code></td>
      <td>Play or pause</td>
      <td>Stop after current track</td>
      <td>Play selected playlist</td>
    </tr>
    <tr>
      <td><code>⏮</code></td>
      <td>Jump to the beginning of the current track or to the previous track</td>
      <td>Rewind 10 seconds</td>
      <td>Select previous playlist</td>
    </tr>
    <tr>
      <td><code>⏭</code></td>
      <td>Jump to next track</td>
      <td>Fast forward 10 seconds</td>
      <td>Select next playlist</td>
    </tr>
  </tbody>
</table>

## Install

```sh
cd /home/volumio
git clone https://github.com/phts/NP-01_buttons.git
cd NP-01_buttons
npm i --only=prod
```

## Usage

`/etc/rc.local`:

```sh
...

sudo bash /home/volumio/NP-01_buttons/run.sh &

...
```

## Debug and development

1. Find process `node app/index.js` and kill it

   ```sh
   ps -elf | grep app/index.js
   sudo kill <PID>
   ```

2. Run this app locally

   ```sh
   cd ~/NP-01_buttons
   sudo node app/index.js
   ```

[PHTS NP-01]: https://tsaryk.com/NP-01
[IR controller]: https://github.com/phts/NP-01_IR-controller-configs
