const fs = require('fs');
const path = require('path');

const dir = 'src/components/rooms';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf-8');
    
    // Add playSuccess and playError to useGameState destruct
    content = content.replace(/const \{([^}]+)\} = useGameState\(\);/, (match, group) => {
        let vars = group.split(',').map(s => s.trim());
        if (!vars.includes('playSuccess')) vars.push('playSuccess');
        if (!vars.includes('playError')) vars.push('playError');
        return `const { ${vars.join(', ')} } = useGameState();`;
    });

    // Inject playError() before setError calls
    content = content.replace(/(set[A-Za-z0-9_]*Error\(true\);)/g, 'playError();\n            $1');

    // Inject playSuccess() before updateGameState setting puzzle flags to true
    content = content.replace(/(updateGameState\(\{\s*[a-zA-Z0-9_]+:\s*true\s*\}\);)/g, 'playSuccess();\n            $1');

    fs.writeFileSync(path.join(dir, f), content);
});

console.log("Patched room components with audio hooks.");
