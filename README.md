# PHTS NP-01: buttons

Front panel button handlers used by [PHTS NP-01].

## Install

```sh
cd /home/volumio
git clone https://github.com/phts/NP-01_buttons.git
cd NP-01_buttons
npm i --omit=dev
```

## Usage

`/etc/rc.local`:

```sh
...

sudo bash /home/volumio/NP-01_buttons/run.sh &

...
```

[PHTS NP-01]: https://tsaryk.com/NP-01
