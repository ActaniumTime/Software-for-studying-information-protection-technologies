document.getElementById('shared-secret-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const clientPublicKey = document.getElementById('client-public-key').value;
    fetch('diffie_hellman_server.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `client_public_key=${clientPublicKey}`
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('shared-secret').textContent = data.shared_secret;
        document.getElementById('result').style.display = 'block';
    });
});
