# PHTS NP-01: buttons

Handlers for front panel buttons used by [PHTS NP-01].

:warning: Some of those commands also used by [IR controller].

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
