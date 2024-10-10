import component from './component';

type tokenType = {
    type: 'variable' | 'rawVariable' | 'control' | 'text' | null,
    value: any,
    index: number,
    condition?: boolean
};

const tokenTree: Array<tokenType> = [];

let regex = /{%[-=]?([\s\S]*?)%}|([^{%]+)/g

function parse(tokens: Array<tokenType>) {
    let match;
    while ((match = regex.exec(component)) !== null) {
        if (match[2]) {
            tokenTree.push({
                type: 'text',
                value: match[2],
                index: match.index
            });
        } else if (match[0].startsWith('{%=')) {
            tokenTree.push({
                type: 'variable',
                value: match[1].trim(),
                index: match.index
            });
        } else if (match[0].startsWith('{%-')) {
            tokenTree.push({
                type: 'rawVariable',
                value: match[1].trim(),
                index: match.index
            });
        } else {
            tokenTree.push({
                type: 'control',
                value: match[1].trim(),
                index: match.index
            });
        };
    };
};

let output: string = '';

const bridge: any = {
    testvariable: 'XSS-safe variables working!'
};

function compile(tokens: Array<tokenType>) {

    let functionBody = 'let output = "";';
    tokens.forEach((token) => {

        switch (token.type) {
            case 'text':
                functionBody += `output += \`${token.value}\`;`;
                break;
            case 'variable':
                functionBody += `output += \`${bridge[token.value]}\`;`;
                break;
            case 'rawVariable':
                functionBody += `output += ${token.value};`;
                break;
            case 'control':
                functionBody += token.value + `;`;
                break;
        };
    });
    functionBody += 'return output;';
    return new Function('context', functionBody);
    
};

function render(component: any, bridge: any) {
    parse(tokenTree);
    const compiledFunction = compile(tokenTree);
    if (!compiledFunction) return console.error(`No compile.`);
    return compiledFunction(bridge);
};

compile(tokenTree);

output = render(component, bridge);

const root = document.getElementById('root');
if (root) {
    root.innerHTML = output
} else {
    console.error('No root element found.')
};