
function bookCipher(message, key) {
    let cipherText = '';
    for (let i = 0; i < message.length; i++) {
        cipherText += (i + 1) + '-';
    }
    return cipherText.slice(0, -1); 
}

function fourSquaresCipher(message) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let cipherText = '';

    for (let i = 0; i < message.length; i++) {
        const letter = message[i].toUpperCase();
        const pos = alphabet.indexOf(letter);

        if (pos !== -1) {
            cipherText += alphabet[(pos + 5) % 26];
        } else {
            cipherText += letter; 
        }
    }
    return cipherText;
}

function adfgvxCipher(message, key) {
    const adfgvx = ['A', 'D', 'F', 'G', 'V', 'X'];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const table = [
        ['A', 'B', 'C', 'D', 'E', 'F'],
        ['G', 'H', 'I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P', 'Q', 'R'],
        ['S', 'T', 'U', 'V', 'W', 'X'],
        ['Y', 'Z', '0', '1', '2', '3'],
        ['4', '5', '6', '7', '8', '9'],
    ];
    let cipherText = '';
    for (let i = 0; i < message.length; i++) {
        const letter = message[i].toUpperCase();
        const pos = alphabet.indexOf(letter);

        if (pos !== -1) {
            const row = Math.floor(pos / 6);
            const col = pos % 6;
            cipherText += adfgvx[row] + adfgvx[col];
        } else {
            cipherText += letter;
        }
    }
    return transposeByKey(cipherText, key);
}
function transposeByKey(text, key) {
    return text.split('').reverse().join('');
}

document.getElementById('cipherForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    const bookKey = document.getElementById('book_key').value;
    const adfgvxKey = document.getElementById('adfgvx_key').value;
    const messageAfterBookCipher = bookCipher(message, bookKey);
    const messageAfterFourSquares = fourSquaresCipher(messageAfterBookCipher);
    const finalCipher = adfgvxCipher(messageAfterFourSquares, adfgvxKey);
    document.getElementById('result').textContent = "Зашифроване повідомлення: " + finalCipher;
});
