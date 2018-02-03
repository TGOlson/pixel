# pixel

#### initial setup

* Install [Ganache](http://truffleframework.com/ganache/)

```
$ npm install
$ npm install -g truffle
$ truffle migrate
```

#### dev

* `npm run dev` to run dev server
* `truffle compile` to compile contracts
* `truffle migrate` to deploy contracts

Open `http://localhost:8080/`

web3 todos

* warn if user is not signed in, but web3 is present

todo

* custom right click/long-press?
  * show pixel
  * show owner
  * purchase/edit if owner
* show warning if trying to color a pixel not owned by current user
* show warning if trying to purchase a pixel already owned by current user
* resize canvas on window resize
* fix weird edges on interactive canvas
* display warning if trying to set states of unowned pixels
* display warning if trying to purchase own pixel
* undo color toolbar button
* display total price
* filter by price
* https://material.io/color/#!/?view.left=0&view.right=0&primary.color=FAFAFA&secondary.color=4A148C
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
