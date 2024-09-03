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

[PHTS NP-01]: https://tsaryk.com/NP-01
[IR controller]: https://github.com/phts/NP-01_IR-controller-configs
