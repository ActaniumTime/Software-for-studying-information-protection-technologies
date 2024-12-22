
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

function rotorEncrypt(text, rotorConfig) {
    let encrypted = "";
    for (let char of text) {
        const index = rotorConfig.indexOf(char);
        if (index !== -1) {
            encrypted += rotorConfig[(index + 5) % rotorConfig.length]; 
        } else {
            encrypted += char; 
        }
    }
    return encrypted;
}

function rotorDecrypt(text, rotorConfig) {
    let decrypted = "";
    for (let char of text) {
        const index = rotorConfig.indexOf(char);
        if (index !== -1) {
            decrypted += rotorConfig[(index - 5 + rotorConfig.length) % rotorConfig.length];
        } else {
            decrypted += char; 
        }
    }
    return decrypted;
}


function mockRSAEncrypt(data, publicKey) {
    return btoa(data.split("").reverse().join("") + publicKey);
}

function mockRSADecrypt(data, privateKey) {
    return atob(data).replace(privateKey, "").split("").reverse().join("");
}

document.getElementById("encryptBtn").addEventListener("click", () => {
    const text = document.getElementById("inputText").value;

    if (!text) {
        alert("Inpur data!");
        return;
    }

    const rotorSeed = "private-key"; 
    const rotorConfig = generateRotorConfig(rotorSeed);
    const encryptedText = rotorEncrypt(text, rotorConfig);
    const encryptedKey = mockRSAEncrypt(rotorSeed, "public-key");

    document.getElementById("encryptedText").value = `${encryptedText}|${encryptedKey}`;
});

document.getElementById("decryptBtn").addEventListener("click", () => {
    const input = document.getElementById("encryptedInput").value;

    if (!input || !input.includes("|")) {
        alert("Input corrected data!");
        return;
    }

    const [encryptedText, encryptedKey] = input.split("|");
    try {
        const rotorSeed = mockRSADecrypt(encryptedKey, "public-key"); 
        const rotorConfig = generateRotorConfig(rotorSeed);
        const decryptedText = rotorDecrypt(encryptedText, rotorConfig);

        document.getElementById("decryptedText").value = decryptedText;
    } catch (error) {
        alert("Error of decryption!");
    }
});

document.getElementById("downloadJson").addEventListener("click", () => {
    const encryptedText = document.getElementById("encryptedText").value;

    if (!encryptedText) {
        alert("No data to download.");
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

document.getElementById("uploadJson").addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) {
        alert("Choose JSON file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);

            if (!jsonData.cipherText || !jsonData.encryptedKey) {
                alert("File`s type isn`t supported.");
                return;
            }
            document.getElementById("encryptedInput").value = `${jsonData.cipherText}|${jsonData.encryptedKey}`;
            alert("File loaded successfully.");
        } catch (error) {
            alert("Error of loading file.");
        }
    };

    reader.readAsText(file);
});
