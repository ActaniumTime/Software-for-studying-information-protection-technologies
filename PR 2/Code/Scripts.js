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
  return atbashEncrypt(text); // Для Атбаша шифрование и дешифровка одинаковы
}

// Квадрат Полибия
const polybiusSquare = [
  ['a', 'b', 'c', 'd', 'e'],
  ['f', 'g', 'h', 'i', 'k'],
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

// Скачивание зашифрованного текста
function downloadEncryptedFile(encryptedText, key, order) {
    const data = {
        encryptedText: encryptedText,
        key: key,
        order: order
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'encryptedData.json';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Обработка шифрования
document.getElementById('encryptBtn').addEventListener('click', function() {
    const text = document.getElementById('textInput').value;
    const order = document.getElementById('order').value;
    let encryptedText = text;
    let key = generateMonoalphabeticKey();
    
    if (order === 'atbash-mono-polybius') {
        encryptedText = atbashEncrypt(encryptedText);
        encryptedText = monoalphabeticEncrypt(encryptedText, key);
        encryptedText = polybiusEncrypt(encryptedText);
    } else if (order === 'mono-atbash-polybius') {
        encryptedText = monoalphabeticEncrypt(encryptedText, key);
        encryptedText = atbashEncrypt(encryptedText);
        encryptedText = polybiusEncrypt(encryptedText);
    }
    
    document.getElementById('resultOutput').value = encryptedText;
    document.getElementById('decryptBtn').disabled = false;
    document.getElementById('downloadBtn').style.display = 'block';

    // Добавление функционала для скачивания файла
    document.getElementById('downloadBtn').addEventListener('click', function() {
        downloadEncryptedFile(encryptedText, key, order);
    });
});

// Обработка загрузки файла и автоматическая дешифровка
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        document.getElementById('textInput').value = data.encryptedText;
        let decryptedText = data.encryptedText;
        
        if (data.order === 'atbash-mono-polybius') {
            decryptedText = polybiusDecrypt(decryptedText);
            decryptedText = monoalphabeticDecrypt(decryptedText, data.key);
            decryptedText = atbashDecrypt(decryptedText);
        } else if (data.order === 'mono-atbash-polybius') {
            decryptedText = polybiusDecrypt(decryptedText);
            decryptedText = atbashDecrypt(decryptedText);
            decryptedText = monoalphabeticDecrypt(decryptedText, data.key);
        }
        
        document.getElementById('resultOutput').value = decryptedText;
    };
    
    reader.readAsText(file);
});

// Очистка всех полей и сброс системы
document.getElementById('clearBtn').addEventListener('click', function() {
    document.getElementById('textInput').value = '';
    document.getElementById('resultOutput').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('decryptBtn').disabled = true;
    document.getElementById('downloadBtn').style.display = 'none';
});
