# home-button

Home button handler used by [PHTS NP-01].

## Install

```sh
cd /home/volumio
git clone https://github.com/phts/NP-01_home-button.git
cd NP-01_home-button
npm i
```

## Usage

`/etc/rc.local`:

```sh
...

sudo bash /home/volumio/NP-01_home-button/run.sh >/home/volumio/NP-01_home-button/rc.log 2>&1 &

...
```

[PHTS NP-01]: https://tsaryk.com/NP-01
