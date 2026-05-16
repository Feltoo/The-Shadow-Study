// ============================================================
// PUZZLE GENERATOR — The Shadow's Study
// Generates a complete, internally-consistent set of puzzle
// data for each playthrough. No two games are the same.
// ============================================================

// --- Utility Helpers ---

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// --- Cipher Engine ---

function cipherEncode(word, shift) {
    return word.split('').map(ch => {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) { // A-Z
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        return ch;
    }).join('');
}

// --- Data Banks ---

const PASSWORD_BANK = ['CLUE', 'NOIR', 'CASE', 'HUNT', 'LEAD', 'VICE', 'COLD', 'MARK'];

const CASE_FILE_BANK = [
    { caseName: "Maltese Affair",     year: "1984", codename: "FALCON" },
    { caseName: "Petrograd Protocol", year: "1967", codename: "WINTER" },
    { caseName: "Tangier Incident",   year: "1953", codename: "SPHINX" },
    { caseName: "Vienna Operation",   year: "1971", codename: "WALTZ"  },
    { caseName: "Havana Directive",   year: "1962", codename: "EMBER"  },
    { caseName: "Odessa Dossier",     year: "1978", codename: "GHOST"  },
];

// --- Code Snippet Generator (for Hazmat Locker) ---

function generateCodeSnippet() {
    const templates = [
        // Template 1: Simple assignment + addition
        () => {
            const a = randomInt(1, 5);
            const b = randomInt(1, 4);
            const result = a + b;
            return {
                code: `x = ${a}\ny = ${b}\nprint(x + y)`,
                answer: String(result).padStart(4, '0'),
                language: 'python'
            };
        },
        // Template 2: Multiplication
        () => {
            const a = randomInt(2, 4);
            const b = randomInt(2, 3);
            const result = a * b;
            return {
                code: `a = ${a}\nb = ${b}\nprint(a * b)`,
                answer: String(result).padStart(4, '0'),
                language: 'python'
            };
        },
        // Template 3: Loop counter
        () => {
            const n = randomInt(3, 7);
            return {
                code: `count = 0\nfor i in range(${n}):\n    count += 1\nprint(count)`,
                answer: String(n).padStart(4, '0'),
                language: 'python'
            };
        },
        // Template 4: Conditional
        () => {
            const x = randomInt(3, 9);
            const result = x > 5 ? x * 2 : x + 1;
            return {
                code: `x = ${x}\nif x > 5:\n    print(x * 2)\nelse:\n    print(x + 1)`,
                answer: String(result).padStart(4, '0'),
                language: 'python'
            };
        },
        // Template 5: String length
        () => {
            const words = ['SHADOW', 'ESCAPE', 'DANGER', 'CIPHER', 'VAULT', 'AGENT', 'CODE'];
            const word = pickFrom(words);
            return {
                code: `msg = "${word}"\nprint(len(msg))`,
                answer: String(word.length).padStart(4, '0'),
                language: 'python'
            };
        },
        // Template 6: Modulo
        () => {
            const a = randomInt(10, 30);
            const b = randomInt(3, 7);
            const result = a % b;
            return {
                code: `x = ${a}\ny = ${b}\nprint(x % y)`,
                answer: String(result).padStart(4, '0'),
                language: 'python'
            };
        },
    ];
    return pickFrom(templates)();
}

const RIDDLE_BANK = [
    { riddle: "I am full of holes but still hold water.",               answer: "SPONGE", maskedRiddle: "I am full of ████ but still hold █████." },
    { riddle: "I have cities, but no houses or people.",                answer: "MAP",    maskedRiddle: "I have ██████, but no ██████ or ██████." },
    { riddle: "The more you take, the more you leave behind.",          answer: "STEPS",  maskedRiddle: "The more you ████, the more you █████ ██████." },
    { riddle: "I speak without a mouth, hear without ears.",            answer: "ECHO",   maskedRiddle: "I █████ without a █████, ████ without ████." },
    { riddle: "I have a head and a tail but no body.",                  answer: "COIN",   maskedRiddle: "I have a ████ and a ████ but no ████." },
    { riddle: "I can be cracked, made, told, and played.",              answer: "JOKE",   maskedRiddle: "I can be ███████, ████, ████, and ██████." },
];

const HATCH_WORD_BANK = ['DARK', 'FREE', 'OPEN', 'EXIT', 'GONE', 'FLEE'];

// --- Logic Test Generator (for Archive Monitors) ---

function generateLogicTests() {
    const testPool = [
        // Letter math: A=1, B=2, ... what is [letter]?
        () => {
            const offset = randomInt(3, 8); // D through H
            const letter = String.fromCharCode(64 + offset);
            return {
                question: `If A=1, B=2, C=3... what is ${letter}?`,
                answer: offset
            };
        },
        // Arithmetic sequence
        () => {
            const step = pickFrom([5, 10, 15, 20]);
            const start = step;
            const terms = [start, start + step, start + step * 2];
            return {
                question: `${terms.join(', ')}, ?`,
                answer: start + step * 3
            };
        },
        // Order of operations
        () => {
            const a = randomInt(2, 5);
            const b = randomInt(2, 5);
            const c = randomInt(2, 5);
            return {
                question: `${a} + ${b} × ${c} = ?`,
                answer: a + (b * c)
            };
        },
        // Simple subtraction
        () => {
            const a = randomInt(50, 100);
            const ans = randomInt(2, 9);
            return {
                question: `${a} - ${a - ans} = ?`,
                answer: ans
            };
        },
        // Double it pattern
        () => {
            const base = randomInt(2, 6);
            return {
                question: `${base}, ${base * 2}, ${base * 4}, ?`,
                answer: base * 8
            };
        },
    ];

    // Pick 3 unique test types
    const shuffled = shuffle(testPool);
    const tests = shuffled.slice(0, 3).map(fn => fn());

    // Build the combined answer string
    const combinedAnswer = tests.map(t => String(t.answer)).join('');

    return { tests, combinedAnswer };
}

// --- Circuit Graph Generator (for Fan Control) ---

function generateCircuit() {
    // Pick 4-5 unique letters for nodes
    const allLetters = 'ABCDEFGHJKLMNPQRSTVWXYZ'.split('');
    const nodeLetters = shuffle(allLetters).slice(0, 5);

    // Build a random branching topology
    // Structure: START → node0 → (branch: node1 → STOP, node2 → OVERLOAD)
    //                         or (branch: node1 → node3 → STOP, node2 → OVERLOAD)
    
    const templates = [
        // Template 1: Fork at first node
        //  START → [A] → [B] → STOP
        //            ↓
        //           [C] → OVERLOAD
        (n) => ({
            safePath: [n[0], n[1]],
            diagram: [
                `START ──→ [${n[0]}] ──→ [${n[1]}] ──→ STOP ✓`,
                `           │`,
                `           ▼`,
                `          [${n[2]}] ──→ OVERLOAD ✗`,
            ],
            blueprintReveals: [0, 1, 2],  // which node indices the blueprint shows
            uvReveals: { STOP: true, OVERLOAD: true },
        }),
        // Template 2: Fork at second node
        //  START → [A] → [B] → [D] → STOP
        //                  ↓
        //                 [C] → OVERLOAD
        (n) => ({
            safePath: [n[0], n[1], n[3]],
            diagram: [
                `START ──→ [${n[0]}] ──→ [${n[1]}] ──→ [${n[3]}] ──→ STOP ✓`,
                `                         │`,
                `                         ▼`,
                `                        [${n[2]}] ──→ OVERLOAD ✗`,
            ],
            blueprintReveals: [0, 1, 2, 3],
            uvReveals: { STOP: true, OVERLOAD: true },
        }),
        // Template 3: Double fork
        //  START → [A] → [C] → OVERLOAD
        //            ↓
        //           [B] → [D] → STOP
        //                  ↓
        //                 [E] → OVERLOAD
        (n) => ({
            safePath: [n[0], n[1], n[3]],
            diagram: [
                `START ──→ [${n[0]}] ──→ [${n[2]}] ──→ OVERLOAD ✗`,
                `           │`,
                `           ▼`,
                `          [${n[1]}] ──→ [${n[3]}] ──→ STOP ✓`,
                `                        │`,
                `                        ▼`,
                `                       [${n[4]}] ──→ OVERLOAD ✗`,
            ],
            blueprintReveals: [0, 1, 2, 3, 4],
            uvReveals: { STOP: true, OVERLOAD: true },
        }),
    ];

    const template = pickFrom(templates);
    const result = template(nodeLetters);
    
    return {
        answer: result.safePath.join(''),
        fullDiagram: result.diagram,
        // Masked diagram: node letters replaced with [?], endpoints replaced with ???
        maskedDiagram: result.diagram.map(line => 
            line.replace(/\[([A-Z])\]/g, '[?]')
                .replace('STOP ✓', '???')
                .replace('OVERLOAD ✗', '???')
        ),
        // Blueprint-revealed diagram: shows letters but not endpoints
        blueprintDiagram: result.diagram.map(line =>
            line.replace('STOP ✓', '???')
                .replace('OVERLOAD ✗', '???')
        ),
        // UV-revealed diagram: shows endpoints but not letters
        uvDiagram: result.diagram.map(line =>
            line.replace(/\[([A-Z])\]/g, '[?]')
        ),
        nodeLetters: nodeLetters.slice(0, 5),
    };
}

// ============================================================
// MAIN GENERATOR
// ============================================================

export function generatePuzzles() {
    // --- Study Room ---

    // Clock: random time, reversed for bookshelf code
    const clockHour = randomInt(1, 12);
    const clockMinute = randomInt(0, 59);
    const clockTimeDisplay = `${String(clockHour).padStart(2, '0')}:${String(clockMinute).padStart(2, '0')}`;
    const clockDigits = `${String(clockHour).padStart(2, '0')}${String(clockMinute).padStart(2, '0')}`;
    const clockCode = clockDigits.split('').reverse().join('');

    // Cipher: random shift 1-5
    const cipherShift = randomInt(1, 5);

    // PC password: pick from bank, encode it
    const pcPasswordDecoded = pickFrom(PASSWORD_BANK);
    const pcPasswordEncoded = cipherEncode(pcPasswordDecoded, cipherShift);

    // Lab door code: random 4 digits
    const labDoorCode = String(randomInt(1000, 9999));

    // PC frequency number (for Monitors)
    const freqNumber = String(randomInt(10, 99));

    // Case file
    const caseFile = pickFrom(CASE_FILE_BANK);

    // --- Lab Room ---

    // Code snippet for hazmat locker
    const codeSnippet = generateCodeSnippet();

    // Generator sequence: random base (2-5)
    const generatorBase = randomInt(2, 5);
    const generatorSequence = [
        Math.pow(generatorBase, 1),
        Math.pow(generatorBase, 2),
        Math.pow(generatorBase, 3),
        Math.pow(generatorBase, 4),
    ];
    const generatorAnswer = String(Math.pow(generatorBase, 5));

    // Generator frequency (for Monitors)
    const genFreq = String(randomInt(10, 99));

    // --- Archive Room ---

    // Cabinet riddle
    const cabinetRiddle = pickFrom(RIDDLE_BANK);

    // Monitor logic tests
    const { tests: monitorTests, combinedAnswer: monitorAnswer } = generateLogicTests();

    // --- Tunnel Room ---

    // Circuit graph for fan control
    const circuit = generateCircuit();

    // Hatch: encoded with same cipher
    const hatchWordDecoded = pickFrom(HATCH_WORD_BANK);
    const hatchWordEncoded = cipherEncode(hatchWordDecoded, cipherShift);

    // --- Assemble ---
    return {
        // Study
        clockHour,
        clockMinute,
        clockTimeDisplay,
        clockCode,
        cipherShift,
        pcPasswordDecoded,
        pcPasswordEncoded,
        labDoorCode,
        freqNumber,
        caseFile,  // { caseName, year, codename }

        // Lab
        codeSnippet,  // { code, answer, language }
        generatorBase,
        generatorSequence,
        generatorAnswer,
        genFreq,

        // Archive
        cabinetRiddle,  // { riddle, answer, maskedRiddle }
        monitorTests,   // [{ question, answer }, ...]
        monitorAnswer,

        // Tunnel
        circuit,  // { answer, fullDiagram, maskedDiagram, blueprintDiagram, uvDiagram }
        hatchWordDecoded,
        hatchWordEncoded,
    };
}
