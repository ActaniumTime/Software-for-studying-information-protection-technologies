// Атбаш
function atbashEncrypt(text) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const reversed = alphabet.split('').reverse().join('');
    return text.toLowerCase().split('').map(char => {
        let index = alphabet.indexOf(char);
        return index !== -1 ? reversed[index] : char;
    }).join('');
}

function atbashDecrypt(text) {
    return atbashEncrypt(text);
}

// Квадрат Полибия
const polybiusSquare = [
    ['a', 'b', 'c', 'd', 'e'],
    ['f', 'g', 'h', 'i', 'k'], // В квадрате Полибия обычно "i" и "j" объединены
    ['l', 'm', 'n', 'o', 'p'],
    ['q', 'r', 's', 't', 'u'],
    ['v', 'w', 'x', 'y', 'z']
];

function polybiusEncrypt(text) {
    const textArr = text.toLowerCase().replace('j', 'i').split('');
    let encrypted = '';
    
    textArr.forEach(char => {
        polybiusSquare.forEach((row, rowIndex) => {
            let colIndex = row.indexOf(char);
            if (colIndex !== -1) {
                encrypted += `${rowIndex + 1}${colIndex + 1}`;
            }
        });
    });
    
    return encrypted;
}

function polybiusDecrypt(encryptedText) {
    let decrypted = '';
    
    for (let i = 0; i < encryptedText.length; i += 2) {
        let row = parseInt(encryptedText[i]) - 1;
        let col = parseInt(encryptedText[i + 1]) - 1;
        decrypted += polybiusSquare[row][col];
    }
    
    return decrypted;
}

// Моноалфавитная подстановка
function generateMonoalphabeticKey() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return alphabet.split('').sort(() => Math.random() - 0.5).join('');
}

function monoalphabeticEncrypt(text, key) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return text.toLowerCase().split('').map(char => {
        let index = alphabet.indexOf(char);
        return index !== -1 ? key[index] : char;
    }).join('');
}

function monoalphabeticDecrypt(text, key) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return text.toLowerCase().split('').map(char => {
        let index = key.indexOf(char);
        return index !== -1 ? alphabet[index] : char;
    }).join('');
}


// Пример использования:
const text = "example text";

// Атбаш
const atbashEncrypted = atbashEncrypt(text);
const atbashDecrypted = atbashDecrypt(atbashEncrypted);
console.log('Atbash:', atbashEncrypted, atbashDecrypted);

// Квадрат Полибия
const polybiusEncrypted = polybiusEncrypt(text);
const polybiusDecrypted = polybiusDecrypt(polybiusEncrypted);
console.log('Polybius:', polybiusEncrypted, polybiusDecrypted);

// Моноалфавитная подстановка
const key = generateMonoalphabeticKey();
const monoEncrypted = monoalphabeticEncrypt(text, key);
const monoDecrypted = monoalphabeticDecrypt(monoEncrypted, key);
console.log('Monoalphabetic:', monoEncrypted, monoDecrypted, 'Key:', key);