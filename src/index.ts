import component from './component';

let regex = /(\{\{\s*(.*?)\s*\}\})|(\{\%(.*?)\%\})|([^{}]+)/g;

let conditionregex = /(\s*\$\((.*?)\)\{(.*?)\})/g

let looper;

type tokenType = {
    type: 'variable' | 'control' | 'text' | null,
    value: any,
    index: number,
    condition?: boolean
}

const tokenTree: Array<tokenType> = [];

function parse(tokens: Array<tokenType>) {
    while ((looper = regex.exec(component)) !== null) {
    
        switch (true) {
            case typeof(looper[1]) !== 'undefined':
                tokens.push({
                    type: 'variable',
                    value: looper[2],
                    index: looper.index
                });
                break;
            case typeof(looper[3]) !== 'undefined':
                if (looper[4].startsWith('if')) {
                    tokens.push({
                        type: 'control',
                        value: looper[4],
                        index: looper.index,
                        condition: true
                    });
                } else {
                    tokens.push({
                        type: 'control',
                        value: looper[4],
                        index: looper.index,
                        condition: false
                    });
                }
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
    date: '2024',
    deneme: 'hello'
};

function compiler(tokens: Array<tokenType>) {

    const root = document.getElementById('root');

    for (const token of tokens) {
        switch (token.type) {
            case 'variable':
                const variableValue = context[token.value] || '';
                output += variableValue;
                break;
            case 'text':
                output += token.value;
                break;
            case 'control':
                let conditionBuffer;
                console.log(token.value)
                while ((conditionBuffer = conditionregex.exec(token.value)) !== null) {
                    console.log('Hello')
                    console.log(conditionBuffer);
                    if (conditionBuffer[2]) {
                        output += context[conditionBuffer[3]];
                        break;
                    }
                }
                break;
        }
    };

    if (!root) return;
    root.innerHTML = output;

};

compiler(tokenTree);