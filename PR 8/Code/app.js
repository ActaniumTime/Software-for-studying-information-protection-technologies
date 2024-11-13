function feistelRound(textHalf, key, alphabet) {
    return textHalf.map((char, idx) => {
        const charIndex = alphabet.indexOf(char);
        const keyIndex = alphabet.indexOf(key[idx % key.length]);
        if (charIndex === -1 || keyIndex === -1) return char;
        const newIndex = (charIndex + keyIndex) % alphabet.length;
        return alphabet[newIndex];
    });
}

function feistelEncrypt(text, key, alphabet, rounds = 4) {
    let left = Array.from(text.slice(0, Math.ceil(text.length / 2)));
    let right = Array.from(text.slice(Math.ceil(text.length / 2)));

    for (let i = 0; i < rounds; i++) {
        const newRight = feistelRound(right, key, alphabet);
        const temp = left.map((char, idx) => {
            const index = alphabet.indexOf(char);
            const shiftIndex = alphabet.indexOf(newRight[idx % newRight.length]);
            return index === -1 ? char : alphabet[(index + shiftIndex) % alphabet.length];
        });

        left = right;
        right = temp;
    }

    return left.concat(right).join("");
}

function feistelDecrypt(text, key, alphabet, rounds = 4) {
    let left = Array.from(text.slice(0, Math.ceil(text.length / 2)));
    let right = Array.from(text.slice(Math.ceil(text.length / 2)));

    for (let i = 0; i < rounds; i++) {
        const newLeft = feistelRound(left, key, alphabet);
        const temp = right.map((char, idx) => {
            const index = alphabet.indexOf(char);
            const shiftIndex = alphabet.indexOf(newLeft[idx % newLeft.length]);
            return index === -1 ? char : alphabet[(index - shiftIndex + alphabet.length) % alphabet.length];
        });

        right = left;
        left = temp;
    }

    return left.concat(right).join("");
}

function encryptText() {
    const text = document.getElementById("text").value;
    const key = document.getElementById("key").value;
    const alphabet = document.getElementById("alphabet").value;

    const encrypted = feistelEncrypt(text, key, alphabet);
    document.getElementById("result").innerText = `Encrypted: ${encrypted}`;
    saveSession(encrypted, key, alphabet);
}

function decryptText() {
    const text = document.getElementById("text").value;
    const key = document.getElementById("key").value;
    const alphabet = document.getElementById("alphabet").value;

    const decrypted = feistelDecrypt(text, key, alphabet);
    document.getElementById("result").innerText = `Decrypted: ${decrypted}`;
}

function saveSession(encryptedText, key, alphabet) {
    fetch("session.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            action: "save",
            encrypted_text: encryptedText,
            key: key,
            alphabet: alphabet
        }),
    }).then(response => response.text())
      .then(data => console.log(data));
}

function downloadJSON() {
    const text = document.getElementById("text").value;
    const key = document.getElementById("key").value;
    const alphabet = document.getElementById("alphabet").value;
    const encrypted = document.getElementById("result").innerText.replace("Encrypted: ", "");

    const data = {
        encryptedText: encrypted,
        originalText: text,
        key: key,
        alphabet: alphabet
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "feistel_data.json";
    link.click();
}

window.onload = function() {
    loadSession();
};

function loadSession() {
    fetch("session.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ action: "load" }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("text").value = data.encrypted_text || "";
        document.getElementById("key").value = data.key || "";
        document.getElementById("alphabet").value = data.alphabet || "";
    });
}
