document.getElementById('encryption-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const p = document.getElementById('p').value;
    const g = document.getElementById('g').value;
    const a = document.getElementById('a').value;
    const B = document.getElementById('B').value;
    const message = document.getElementById('message').value;

    fetch('server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `p=${p}&g=${g}&a=${a}&B=${B}&message=${encodeURIComponent(message)}`
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('public-key').textContent = data.public_key;
        document.getElementById('shared-secret').textContent = data.shared_secret;
        document.getElementById('vigenere-key').textContent = data.vigenere_key;
        document.getElementById('vigenere-encrypted').textContent = data.vigenere_encrypted;
        document.getElementById('aes-encrypted').textContent = data.aes_encrypted;
        document.querySelector('.results-wrapper').classList.remove('d-none');
        document.getElementById('download-json').addEventListener('click', () => {
            const jsonData = {
                publicKey: data.public_key,
                sharedSecret: data.shared_secret,
                vigenereKey: data.vigenere_key,
                vigenereEncrypted: data.vigenere_encrypted,
                aesEncrypted: data.aes_encrypted
            };

            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'results.json';
            a.click();

            URL.revokeObjectURL(url);
        });
    });
});
