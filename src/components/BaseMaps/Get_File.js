const testFolder = './shape_files/';
const fs = require('fs');

export const getFiles = () => {
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    });
}