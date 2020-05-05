'use strict';
//ファイルの情報を読みとる
//モジュールの呼び出し　fs=ファイルを扱うモジュール　readline=ファイルを１行ずつ読み込むモジュール
const fs = require('fs');
const readline = require('readline');

//pupu-prefCSVファイルからファイル読み込みを行うストリームを作成、それをreadlineオブジェクトのインプットとして設定
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

//ファイルからデータを抜き出す
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);

    if (year === 2010 || year === 2015) {
        //人口データを貯める
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});

//人口変化率を計算,並び替え
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) =>{
        return pair2[1].change - pair1[1].change;
    });
    //Map関数は、各要素に関数を適用し新しい配列をつくる
    const rankingStrings = rankingArray.map(([key,value]) => {
        return key + ': ' + value.popu10 + '=>' + value.popu15 + '変化率' +value.change;
    });
    console.log(rankingStrings);
});


