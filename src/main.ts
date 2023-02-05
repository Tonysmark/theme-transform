const path = require('path');
const fs = require('fs');
const glob = require('glob');
const { countScssFileColors } = require('./countFileColor')


glob('../../app_hybrid_v10/src/**/*.vue', (err, matched) => {
    if (err) throw err;
    const sets = new Set();
    new Promise(resolve => {
        matched.forEach(async scssFilePath => {
            if (!scssFilePath.match('colormap.scss')) {
                const filePath = path.resolve(__dirname, scssFilePath);
                const countSets = await countScssFileColors(filePath);
                for (const color of countSets) {
                    sets.add(color)
                }
                console.log("sets : ",sets)
            }
            resolve(0)
        });
    })
})

