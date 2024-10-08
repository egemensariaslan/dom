import fs from 'fs'

console.log('Hello World!');

let text: string = fs.readFileSync('./src/app.hello', 'utf-8');

let regex = /(\{\{(.*?)\}\})|(\{%(.*?)%\})|([^{}]+)/g;

let looper;

type tokenType = {
    type: 'variable' | 'control' | 'text' | null,
    value: any,
    index: number
}

const tokenTree: Array<tokenType> = [];

function parse(tokens: Array<tokenType>) {
    while ((looper = regex.exec(text)) !== null) {
    
        switch (true) {
            case typeof(looper[1]) !== 'undefined':
                tokens.push({
                    type: 'variable',
                    value: looper[2],
                    index: looper.index
                });
                break;
            case typeof(looper[3]) !== 'undefined':
                tokens.push({
                    type: 'control',
                    value: looper[4],
                    index: looper.index
                });
                break;
            case typeof(looper[5]) !== 'undefined':
                tokens.push({
                    type: 'text',
                    value: looper[5],
                    index: looper.index
                });
                break;
        };
    
    };
}

parse(tokenTree);


console.log(tokenTree)