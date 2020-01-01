
const fs = require('fs-extra');
const path = require('path');

const ECMA_2015Store = 'ECMA_2015Store';
const ECMA_2016Store = 'ECMA_2016Store';
const ECMA_2017Store = 'ECMA_2017Store';
const ECMA_2018Store = 'ECMA_2018Store';
const ECMA_2019Store = 'ECMA_2019Store';
const ECMA_2020Store = 'ECMA_2020Store';

function revert(jsonPath) {
  fs.readJson(`./${jsonPath}.json`, (err, packageObj) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(packageObj.version) // => 0.1.3
  })
}