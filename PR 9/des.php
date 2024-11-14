<?php

function initialPermutation($block) {
    $table = [58, 50, 42, 34, 26, 18, 10, 2,
              60, 52, 44, 36, 28, 20, 12, 4,
              62, 54, 46, 38, 30, 22, 14, 6,
              64, 56, 48, 40, 32, 24, 16, 8,
              57, 49, 41, 33, 25, 17, 9, 1,
              59, 51, 43, 35, 27, 19, 11, 3,
              61, 53, 45, 37, 29, 21, 13, 5,
              63, 55, 47, 39, 31, 23, 15, 7];
    return permute($block, $table);
}

function finalPermutation($block) {
    $table = [40, 8, 48, 16, 56, 24, 64, 32,
              39, 7, 47, 15, 55, 23, 63, 31,
              38, 6, 46, 14, 54, 22, 62, 30,
              37, 5, 45, 13, 53, 21, 61, 29,
              36, 4, 44, 12, 52, 20, 60, 28,
              35, 3, 43, 11, 51, 19, 59, 27,
              34, 2, 42, 10, 50, 18, 58, 26,
              33, 1, 41, 9, 49, 17, 57, 25];
    return permute($block, $table);
}

function permute($block, $table) {
    $permuted = '';
    foreach ($table as $pos) {
        $permuted .= $block[$pos - 1];
    }
    return $permuted;
}

function generateKeys($key) {
    return array_fill(0, 16, $key);
}

function feistelFunction($halfBlock, $subKey) {
    return $halfBlock ^ $subKey;
}

function desEncrypt($block, $keys) {
    $block = initialPermutation($block);
    $left = substr($block, 0, 32);
    $right = substr($block, 32, 32);

    for ($i = 0; $i < 16; $i++) {
        $tempRight = $right;
        $right = $left ^ feistelFunction($right, $keys[$i]);
        $left = $tempRight;
    }

    $combined = $right . $left;
    return finalPermutation($combined);
}

function desDecrypt($block, $keys) {
    $block = initialPermutation($block);
    $left = substr($block, 0, 32);
    $right = substr($block, 32, 32);

    for ($i = 15; $i >= 0; $i--) {
        $tempRight = $right;
        $right = $left ^ feistelFunction($right, $keys[$i]);
        $left = $tempRight;
    }

    $combined = $right . $left;
    return finalPermutation($combined);
}

function textToBinary($text) {
    $binary = '';
    for ($i = 0; $i < strlen($text); $i++) {
        $binary .= str_pad(decbin(ord($text[$i])), 8, '0', STR_PAD_LEFT);
    }
    return $binary;
}

function binaryToText($binary) {
    $text = '';
    for ($i = 0; $i < strlen($binary); $i += 8) {
        $text .= chr(bindec(substr($binary, $i, 8)));
    }
    return $text;
}

function padText($text) {
    $padLength = 8 - (strlen($text) % 8);
    return $text . str_repeat(chr($padLength), $padLength);
}

function unpadText($text) {
    $padLength = ord(substr($text, -1));
    return substr($text, 0, -$padLength);
}

function desEncryptText($text, $keys) {
    $paddedText = padText($text);
    $encrypted = '';

    for ($i = 0; $i < strlen($paddedText); $i += 8) {
        $block = substr($paddedText, $i, 8);
        $binaryBlock = textToBinary($block);
        $encryptedBlock = desEncrypt($binaryBlock, $keys);
        $encrypted .= $encryptedBlock;
    }

    return $encrypted;
}

function desDecryptText($text, $keys) {
    $decrypted = '';

    for ($i = 0; $i < strlen($text); $i += 64) {
        $block = substr($text, $i, 64);
        $decryptedBlock = desDecrypt($block, $keys);
        $decrypted .= binaryToText($decryptedBlock);
    }

    return unpadText($decrypted);
}

function saveToJson($text, $key) {
    $data = [
        "encrypted_text" => $text,
        "key" => $key
    ];
    file_put_contents('result.json', json_encode($data));
}

function loadFromJson() {
    if (file_exists('result.json')) {
        return json_decode(file_get_contents('result.json'), true);
    }
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $text = $_POST['text'];
    $key = $_POST['key'];
    $action = $_POST['action'];

    if (strlen($key) !== 8) {
        echo "Key must be exactly 8 characters.";
        exit;
    }

    $binaryKey = textToBinary($key);
    $keys = generateKeys($binaryKey);

    if ($action === 'encrypt') {
        $encryptedBinaryText = desEncryptText($text, $keys);
        $output = binaryToText($encryptedBinaryText);
        saveToJson($output, $key);

    } elseif ($action === 'decrypt') {
        $jsonData = loadFromJson();
        if ($jsonData) {
            $text = $jsonData['encrypted_text'];
            $binaryText = textToBinary($text);
            $output = desDecryptText($binaryText, $keys);
        } else {
            echo "No data found to decrypt.";
            exit;
        }
    }

    echo htmlspecialchars($output);
}
?>
