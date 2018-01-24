# pixel

#### initial setup

```
$ npm install
$ npm install -g truffle
$ truffle develop
truffle(develop)> migrate
```

#### dev

```
$ npm run dev
$ truffle develop
```

Open `http://localhost:8080/`


todo

* resize canvas on window resize
* highlight section
* display total price
* filter by price
* update material theme
* server?

Note: max gas per block is current ~8m. Buying 10 pixels at once will take roughly 400k gas. This app should probably limit purchases to 10 at a time, or split purchases into groups of 10.

notes

* [pixel doc](https://docs.google.com/document/d/1wItSPEcXBqN1iwTlEV7A5rPlsc8y48I79SDCXM94CJc/edit?ts=5a610857)
* https://material-ui-next.com/
* https://material.io/icons/
* https://github.com/ethereum/EIPs/issues/721
* http://truffleframework.com/docs/getting_started/installation
* https://github.com/truffle-box/react-box/blob/master/src/App.js
* https://github.com/trufflesuite/truffle-contract
* https://solidity.readthedocs.io/en/develop/

note: this is a private repo. if this project tanks, remember to convert back to public repo
