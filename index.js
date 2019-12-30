const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs-extra');

const BASE_URL = 'https://developer.mozilla.org';
const MDN_JS_GLOBAL_OBJECTS_URL = `${BASE_URL}/zh-CN/docs/Web/JavaScript/Reference/Global_Objects`;

async function loadHTML(url) {
  // 每三秒调用一次  防止被拦截
  console.log('3s后继续...');
  await new Promise(function(resolve) {
    setTimeout(resolve, 3000)
  })
  try {
    const res = await superagent.get(url);
    return cheerio.load(res.res.text);
  } catch(e) {
    throw e;
  }
}

async function fetchObjectUrls() {
  try {
    const $ = await loadHTML(MDN_JS_GLOBAL_OBJECTS_URL);
    const summaries = $('summary').toArray();
    const urls = [];
    return new Promise(function(resolve, reject) {
      for (let i = 0; i < summaries.length; i ++) {
        if ($(summaries[i]).text() === 'Built-in objects' || $(summaries[i]).text() === '内置对象') {
          $(summaries[i]).next().children().each(function() {
            const _path = $(this).children('a').attr('href');
            urls.push(_path);
            resolve(urls);
          });
          break;
        }
      }
      if (_path.length === 0) {
        reject('Built-in objects Not Found !');
      }
    })
  } catch(e) {
    throw e;
  }
}

function findOlEle($, summaries, text, textZh) {
  for (let i = 0; i < summaries.length; i ++) {
        if ($(summaries[i]).text() === text || $(summaries[i]).text() === textZh) {
          return $(summaries[i])
        }
  }
  return $;
}

async function fetchNavUrls($ol, $) {
  return new Promise(function(resolve, rejcts) {
    let urls = [];
    $ol.children().each(function() {
      const _path = $(this).children('a').attr('href');
      urls.push(_path);
      resolve(urls);
    });
  });
}


const ECMA_2015 = 'ECMAScript 2015';
const ECMA_2016 = 'ECMAScript 2016';
const ECMA_2017 = 'ECMAScript 2017';
const ECMA_2018 = 'ECMAScript 2018';
const ECMA_2019 = 'ECMAScript 2019';
const ECMA_2020 = 'ECMAScript 2020';

let ECMA_2015Store = {};
let ECMA_2016Store = {};
let ECMA_2017Store = {};
let ECMA_2018Store = {};
let ECMA_2019Store = {};
let ECMA_2020Store = {};

async function loadSpecificObject() {
  try {
    const urls = await fetchObjectUrls();
    for (let i = 0; i < urls.length; i ++) {
      const url = urls[i];
      if (!url) continue;
      console.log('加载对象URL:开始：', url);
      const $ = await loadHTML(`${BASE_URL}${url}`);
      console.log('加载对象URL:结束：', url);
      const tEle = findOlEle($, $('strong'), 'Methods', '方法');
      console.log('加载导航栏URL:开始：');
      const navUrls = await fetchNavUrls(tEle.parent().next(), $);
      console.log('加载导航栏URL:结束：');
      const objectName = url.split('/').pop();
      ECMA_2015Store[objectName] = ECMA_2015Store[objectName] || [];
      ECMA_2016Store[objectName] = ECMA_2016Store[objectName] || [];
      ECMA_2017Store[objectName] = ECMA_2017Store[objectName] || [];
      ECMA_2018Store[objectName] = ECMA_2018Store[objectName] || [];
      ECMA_2019Store[objectName] = ECMA_2019Store[objectName] || [];
      ECMA_2020Store[objectName] = ECMA_2020Store[objectName] || [];
      for (let i = 0; i < navUrls.length; i ++) {
        const navUrl = navUrls[i];
        if (!navUrl) continue;
        console.log('加载方法URL:开始：', navUrl);
        const specificObject = await loadHTML(`${BASE_URL}${navUrl}`);
        console.log('加载方法URL:结束：', navUrl);
        const specificationText = specificObject('.standard-table tr').eq(2).html();
        if (!specificationText) continue;
        const methodName = navUrl.split('/').pop();
        if (specificationText.indexOf(ECMA_2015) !== -1) {
          ECMA_2015Store[objectName].push(methodName);
        } else if (specificationText.indexOf(ECMA_2016) !== -1) {
          ECMA_2016Store[objectName].push(methodName);
        } else if (specificationText.indexOf(ECMA_2017) !== -1) {
          ECMA_2017Store[objectName].push(methodName);
        } else if (specificationText.indexOf(ECMA_2018) !== -1) {
          ECMA_2018Store[objectName].push(methodName);
        } else if (specificationText.indexOf(ECMA_2019) !== -1) {
          ECMA_2019Store[objectName].push(methodName);
        } else if (specificationText.indexOf(ECMA_2020) !== -1) {
          ECMA_2020Store[objectName].push(methodName);
        }
      }
    }
    return true;
  } catch (e) {
    console.error(e);
  }
}

loadSpecificObject().then(function() {
  fs.outputJson('./ECMA_2015Store.json', ECMA_2015Store, console.error);
  fs.outputJson('./ECMA_2016Store.json', ECMA_2016Store, console.error);
  fs.outputJson('./ECMA_2017Store.json', ECMA_2017Store, console.error);
  fs.outputJson('./ECMA_2018Store.json', ECMA_2018Store, console.error);
  fs.outputJson('./ECMA_2019Store.json', ECMA_2019Store, console.error);
  fs.outputJson('./ECMA_2020Store.json', ECMA_2020Store, console.error);
});