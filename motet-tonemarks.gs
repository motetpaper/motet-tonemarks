/**
 * motet-tonemarks.gs
 * job    : Converts tone numbers to tone marks
 * git    : https://github.com/motetpaper/motet-tonemarks
 * lic    : MIT
 * version: 3.5.1
 * @OnlyCurrentDoc Limits the script to only accessing the current spreadsheet.
 */

const tm    = {};
const tmiso = {}; // ISO-compliant tonemarks
const tf    = {}; // fifth tone

// load data

(function(){
  const url = 'https://raw.githubusercontent.com/motetpaper/data/refs/heads/main/pnyn/tmiso.json'
  const headers = {
    'Cache-Control' : 'max-age=259200'
  };
  const resp = UrlFetchApp.fetch(url, headers);
  const text = resp.getContentText();
  tmiso.data = JSON.parse(text.trim());
})();

(function(){
  const url = 'https://raw.githubusercontent.com/motetpaper/data/refs/heads/main/pnyn/tm.json'
  const headers = {
    'Cache-Control' : 'max-age=259200'
  };
  const resp = UrlFetchApp.fetch(url, headers);
  const text = resp.getContentText();
  tm.data = JSON.parse(text.trim());
})();

(function(){
  const url = 'https://raw.githubusercontent.com/motetpaper/data/refs/heads/main/pnyn/tf.json'
  const headers = {
    'Cache-Control' : 'max-age=259200'
  };
  const resp = UrlFetchApp.fetch(url, headers);
  const text = resp.getContentText();
  tf.data = JSON.parse(text.trim());
})();


/**
 * Converts numbered pinyin to legacy tone marks.
 *
 * @param {string} text - numbered pinyin text or range of text.
 * @return {string} Hanyu Pinyin with tone marks.
 * @customfunction
 */
function MOTET_TONEMARKS(text) {
  switch(typeof text){
    case 'string':
      return motet_tm_(text);

    case 'object':
      if(text instanceof Date) {
        return text;
      }

      if(text instanceof Array) {
        return text.map(MOTET_TONEMARKS);
      }

      return '';
  default:
    // pass-through input
    return text;
  }
}


/**
 * Converts numbered pinyin to ISO-compliant tone marks.
 *
 * @param {string} text - numbered pinyin text or range of text.
 * @return {string} Hanyu Pinyin with ISO tone marks.
 * @customfunction
 */
function MOTET_TONEMARKS_ISO(text) {
  switch(typeof text){
    case 'string': 
      return motet_tmi_(text);

    case 'object':
      if(text instanceof Date) {        
        return text;
      }

      if(text instanceof Array) {
        return text.map(MOTET_TONEMARKS_ISO);
      }
    
      return '';
  default:
    // pass-through input
    return text;
  }
}



/**
 * Helper functions
 */


// returns hanyu pinyin with tone marks
function motet_tm_(text) {

  for(let t in tm.data) {
    text = text.replace((new RegExp(t, 'g')), '' + tm.data[t]);
  }

  for(let f in tf.data) {
    text = text.replace((new RegExp(f, 'g')), '' + tf.data[f]);
  }

  text = motet_finish_(text);
  return text;
}


// returns hanyu pinyin with ISO tone marks
function motet_tmi_(text) {

  for(let t in tmiso.data) {
    text = text.replace((new RegExp(t, 'g')), '' + tmiso.data[t]);
  }

  for(let f in tf.data) {
    text = text.replace((new RegExp(f, 'g')), '' + tf.data[f]);
  }

  text = motet_finish_(text);
  return text;
}


// returns cleaned up text after processing
function motet_finish_(str) {
  return str.replace((new RegExp('[^\\S\\n]{2,}', 'g')), ' ').trim();
}
