
const fs = require('fs-extra');
const path = require('path');

const ECMA_2015Store = 'ECMA_2015Store';
const ECMA_2016Store = 'ECMA_2016Store';
const ECMA_2017Store = 'ECMA_2017Store';
const ECMA_2018Store = 'ECMA_2018Store';
const ECMA_2019Store = 'ECMA_2019Store';
const ECMA_2020Store = 'ECMA_2020Store';

function revert(jsonPath) {
  fs.readJson(`./${jsonPath}.json`, (err, esVersionInfo) => {
    if (err) {
      console.error(err);
      return;
    }
    let targetMD = '';
    for (let esVersionInfoItemKey in esVersionInfo) {
      let esVersionInfoItems = esVersionInfo[esVersionInfoItemKey];
      if (!esVersionInfoItems || esVersionInfoItems.length === 0) continue;
      targetMD += moudleTemplate(esVersionInfoItemKey, esVersionInfoItems);
    }
    fs.outputFile(`./${jsonPath}.md`, targetMD, function (err) {
      if (err) console.error(err)
    })
  })
}

function moudleTemplate(title, subKeys) {
  let target = `# ${title}
  ${subKeys.map(generateSubLine).join('\n')}
  `;
  function generateSubLine(subKey, index) {
    return `${index + 1}. ${title}.${subKey}`;
  }
  return target;
}
revert(ECMA_2015Store);
revert(ECMA_2016Store);
revert(ECMA_2017Store);
revert(ECMA_2018Store);
revert(ECMA_2019Store);
revert(ECMA_2020Store);