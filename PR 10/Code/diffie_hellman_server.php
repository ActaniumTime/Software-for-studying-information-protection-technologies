<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $p = intval($_POST['p']);
    $g = intval($_POST['g']);
    $privateKey = rand(1, $p - 1);
    $publicKey = bcpowmod($g, $privateKey, $p);
    $_SESSION['private_key'] = $privateKey;
    $_SESSION['p'] = $p;
    $_SESSION['g'] = $g;
    echo json_encode(['public_key' => $publicKey]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $data);
    $clientPublicKey = intval($data['client_public_key']);
    $privateKey = $_SESSION['private_key'];
    $p = $_SESSION['p'];
    $sharedSecret = bcpowmod($clientPublicKey, $privateKey, $p);
    echo json_encode(['shared_secret' => $sharedSecret]);
    exit();
}
?>
