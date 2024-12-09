document.getElementById('dh-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const p = document.getElementById('p').value;
    const g = document.getElementById('g').value;

    fetch('diffie_hellman_server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `p=${p}&g=${g}`
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('public-key').textContent = data.public_key;
        document.getElementById('public-key-section').style.display = 'block';
        localStorage.setItem('publicKey', data.public_key);
    });
});
