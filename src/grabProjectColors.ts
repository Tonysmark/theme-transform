import path from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';
import { hexColorRegex } from './util';
import { write2log } from './write2log';

export const strictRegex = /#[a-fA-F0-9]{3,8}|rgba?\((\d{0,3})\s*,\s*(\d{0,3})\s*,\s*(\d{0,3})\s*,?\s*([\.\d]+?)?\)/gm;
const planRegex = /#[a-fA-F0-9]{3,8}|rgb\(.*?\)|rgba\(.*?\)/gi;

const getJsonData = (matchedColorSet: Set<string>) => {
    const json2ExcelData = Array.from<string>(matchedColorSet)
        .map((item) => {
            if (item.match(new RegExp(hexColorRegex, 'gm'))) {
                return {
                    raw: item,
                    dark: null,
                    variable: `--color-${item.replace('#', '').toLowerCase()}`,
                };
            } else {
                return {
                    raw: item,
                    dark: null,
                    variable: `--color-${item
                        .replace(/^rgba?\(|\s+|\)$/g, '')
                        .split(',')
                        .map((item) => item.replace('.', ''))
                        .join('-')}`,
                };
            }
        })
        .sort((prev, next) => prev.raw.localeCompare(next.raw));

    write2log('sorted-colors.json', JSON.parse(JSON.stringify(json2ExcelData, null, 4)));
};
type ScssMap = Record<string, Record<'light' | 'dark', string>>;
const getSassData = (matchedColorSet: Set<string>) => {
    const scssMap = Array.from<string>(matchedColorSet)
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc, curr) => {
            if (curr.match(new RegExp(hexColorRegex, 'gm'))) {
                const key = curr.replace('#', '').toLowerCase();
                acc[key] = {
                    dark: curr.toLowerCase(),
                    light: curr.toLowerCase(),
                };
            } else {
                const rgbVal = curr
                    .replace(/^rgba?\(|\s+|\)$/g, '')
                    .split(',')
                    .map((item) => item.replace('.', ''))
                    .join('-');
                acc[rgbVal] = {
                    dark: curr,
                    light: curr,
                };
            }
            return acc;
        }, {} as ScssMap);

    let scssMapStr = '';
    Object.keys(scssMap)
        .sort((a, b) => a.localeCompare(b))
        .forEach((item) => {
            const { light, dark } = scssMap[item];
            scssMapStr += `
            "${item}":(
                    
                "dark":"${dark}",
                "light": "${light}"
                ),
            `;
        });
    write2log('theme.scss', `$theme-map: (${scssMapStr});`);
};

glob(path.join(__dirname, '../../app_hybrid_v10/src/**/*.*(vue|css|less|scss)'), (err, matchedPath) => {
    if (err) throw err;
    const matchedColorSet = matchedPath.reduce((acc, cur) => {
        const dataString = readFileSync(path.resolve(cur)).toString();
        const matched = dataString.match(strictRegex);
        if (Array.isArray(matched)) {
            matched.forEach((item) => acc.add(item));
        }
        return acc;
    }, new Set());

    getJsonData(matchedColorSet);

    // getSassData(matchedColorSet);
});
