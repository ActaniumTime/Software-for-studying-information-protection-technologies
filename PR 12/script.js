// Генерация псевдослучайных перестановок для роторов
function generateRotorConfig(seed) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?";
    let arr = chars.split("");
    for (let i = 0; i < seed.length; i++) {
        const index = seed.charCodeAt(i) % arr.length;
        const [removed] = arr.splice(index, 1);
        arr.push(removed);
    }
    return arr;
}

// Шифрование через роторы
function rotorEncrypt(text, rotorConfig) {
    let encrypted = "";
    for (let char of text) {
        const index = rotorConfig.indexOf(char);
        if (index !== -1) {
            encrypted += rotorConfig[(index + 5) % rotorConfig.length]; // Смещение на 5
        } else {
            encrypted += char; // Если символ отсутствует в роторе, оставляем как есть
        }
    }
    return encrypted;
}

// Дешифрование через роторы
function rotorDecrypt(text, rotorConfig) {
    let decrypted = "";
    for (let char of text) {
        const index = rotorConfig.indexOf(char);
        if (index !== -1) {
            decrypted += rotorConfig[(index - 5 + rotorConfig.length) % rotorConfig.length]; // Обратное смещение
        } else {
            decrypted += char; // Если символ отсутствует в роторе, оставляем как есть
        }
    }
    return decrypted;
}

// Симуляция RSA-шифрования
function mockRSAEncrypt(data, publicKey) {
    return btoa(data.split("").reverse().join("") + publicKey);
}

function mockRSADecrypt(data, privateKey) {
    return atob(data).replace(privateKey, "").split("").reverse().join("");
}

// Настройка событий
document.getElementById("encryptBtn").addEventListener("click", () => {
    const text = document.getElementById("inputText").value;

    if (!text) {
        alert("Введите текст для шифрования.");
        return;
    }

    const rotorSeed = "private-key"; // Секретный ключ для роторов
    const rotorConfig = generateRotorConfig(rotorSeed);
    const encryptedText = rotorEncrypt(text, rotorConfig);
    const encryptedKey = mockRSAEncrypt(rotorSeed, "public-key"); // Симуляция RSA

    document.getElementById("encryptedText").value = `${encryptedText}|${encryptedKey}`;
});

document.getElementById("decryptBtn").addEventListener("click", () => {
    const input = document.getElementById("encryptedInput").value;

    if (!input || !input.includes("|")) {
        alert("Введите корректный зашифрованный текст.");
        return;
    }

    const [encryptedText, encryptedKey] = input.split("|");
    try {
        const rotorSeed = mockRSADecrypt(encryptedKey, "public-key"); // Расшифровка RSA
        const rotorConfig = generateRotorConfig(rotorSeed);
        const decryptedText = rotorDecrypt(encryptedText, rotorConfig);

        document.getElementById("decryptedText").value = decryptedText;
    } catch (error) {
        alert("Ошибка дешифровки. Проверьте входные данные.");
    }
});


// Скачивание JSON
document.getElementById("downloadJson").addEventListener("click", () => {
    const encryptedText = document.getElementById("encryptedText").value;

    if (!encryptedText) {
        alert("Нет данных для сохранения. Зашифруйте текст перед скачиванием.");
        return;
    }

    const [cipherText, encryptedKey] = encryptedText.split("|");
    const data = {
        cipherText,
        encryptedKey,
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted_data.json";
    a.click();

    URL.revokeObjectURL(url);
});

// Загрузка JSON
document.getElementById("uploadJson").addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) {
        alert("Выберите файл JSON.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);

            if (!jsonData.cipherText || !jsonData.encryptedKey) {
                alert("Файл не соответствует ожидаемому формату.");
                return;
            }

            // Установим данные в соответствующие поля
            document.getElementById("encryptedInput").value = `${jsonData.cipherText}|${jsonData.encryptedKey}`;
            alert("Файл загружен. Вы можете приступить к дешифровке.");
        } catch (error) {
            alert("Ошибка при чтении файла. Проверьте его содержимое.");
        }
    };

    reader.readAsText(file);
});

// Добавление динамических ключевых кадров для анимации
function addDynamicKeyframes() {
    const keyframes = `@keyframes rotorScroll {
        from { transform: translateX(100%); }
        to { transform: translateX(-100%); }
    }`;

    const styleSheet = document.styleSheets[0] || document.createElement("style");
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

// Включение анимации процесса шифровки/дешифровки
function animateProcess(text, rotorConfig) {
    addDynamicKeyframes(); // Добавляем ключевые кадры

    const animationContainer = document.getElementById("rotorAnimation");
    animationContainer.textContent = ""; // Сброс анимации перед началом
    let animatedText = "";

    text.split("").forEach((char, index) => {
        const charIndex = rotorConfig.indexOf(char);
        const encryptedChar =
            charIndex !== -1 ? rotorConfig[(charIndex + 5) % rotorConfig.length] : char;

        animatedText += encryptedChar;
        setTimeout(() => {
            animationContainer.textContent = animatedText; // Обновление строки анимации
        }, index * 300); // Задержка для поэтапного добавления символов
    });
}
