import path from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';
import { rgb2hex } from './util';
import { write2log } from './write2log';

const getJsonData = (matchedColorSet: Set<string>) => {
    const json2ExcelData = Array.from<string>(matchedColorSet)
        .map((item) => ({ raw: item, 'hex(a)': rgb2hex(item) }))
        .sort((prev, next) => {
            return prev.raw.localeCompare(next.raw);
        });
    write2log('sorted-colors.json', JSON.parse(JSON.stringify(json2ExcelData, null, 4)));
};

const getSassData = (matchedColorSet: Set<string>) => {
    const scssMap = Array.from<string>(matchedColorSet).reduce((acc, curr) => {
        // 生成后的文件 手动删掉哪些 $theme 这种变量
        const hex = rgb2hex(curr);
        acc[hex] = hex;
        return acc;
    }, {});
    write2log('sass-map.scss', `$theme-map: ( ${JSON.stringify(scssMap)} )`);
};

glob(path.join(__dirname, '../../app_hybrid_v10/src/**/*.*(vue|css|less|scss)'), (err, matchedPath) => {
    if (err) throw err;
    const matchedColorSet = matchedPath.reduce((acc, cur) => {
        const data = readFileSync(path.resolve(cur));
        const dataString = data.toString();
        const matched = dataString.match(/#[a-fA-F0-9]{3,8}|rgb\(.*?\)|rgba\(.*?\)/gi);
        if (Array.isArray(matched)) {
            matched
                .map((item) => item.toLocaleLowerCase())
                .forEach((item) => {
                    acc.add(item);
                    return acc;
                });
        }
        return acc;
    }, new Set());

    getJsonData(matchedColorSet);

    getSassData(matchedColorSet);
});
