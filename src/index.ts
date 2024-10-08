import fs from 'fs'

console.log('Hello World!');

let text: string = fs.readFileSync('./src/app.hello', 'utf-8');

let regex = /(\{\{\s*(.*?)\s*\}\})|(\{%(.*?)%\})|([^{}]+)/g;

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

let output: string = '';

const context: any = {
    author: 'Egemen',
    date: '2024'
};

function compiler(tokens: Array<tokenType>) {

    for (const token of tokens) {
        switch (token.type) {
            case 'variable':
                const variableValue = context[token.value] || '';
                output += variableValue;
                break;
        }
    };

};

compiler(tokenTree);

console.log(output)


console.log(tokenTree)