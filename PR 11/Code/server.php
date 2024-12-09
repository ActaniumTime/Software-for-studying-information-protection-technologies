<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $p = intval($_POST['p']);
    $g = intval($_POST['g']);
    $a = intval($_POST['a']);
    $B = intval($_POST['B']);
    $message = $_POST['message'];

    $A = bcpowmod($g, $a, $p);
    $S = bcpowmod($B, $a, $p);

    $sharedKeyBinary = hash('sha256', $S, true);
    $sharedKeyHex = bin2hex($sharedKeyBinary);
    $vigenereKey = substr($sharedKeyHex, 0, 16);

    function vigenereEncrypt($text, $key) {
        $output = '';
        $keyLength = strlen($key);
        $keyIndex = 0;

        for ($i = 0; $i < strlen($text); $i++) {
            $char = $text[$i];
            if (ctype_alpha($char)) {
                $isUpper = ctype_upper($char);
                $offset = $isUpper ? ord('A') : ord('a');

                $charVal = ord($char) - $offset;
                $keyVal = ord($key[$keyIndex % $keyLength]) - ord('a');
                if ($keyVal < 0) $keyVal = 0;

                $encVal = ($charVal + $keyVal) % 26;
                $output .= chr($encVal + $offset);
                $keyIndex++;
            } else {
                $output .= $char;
            }
        }

        return $output;
    }

    function hexToAlphaKey($hex) {
        $alphaKey = '';
        for ($i = 0; $i < strlen($hex); $i += 2) {
            $byte = hexdec(substr($hex, $i, 2));
            $alphaKey .= chr(($byte % 26) + ord('a'));
        }
        return $alphaKey;
    }

    $vigenereKeyAlpha = hexToAlphaKey($vigenereKey);
    $vigenereEncrypted = vigenereEncrypt($message, $vigenereKeyAlpha);

    $iv = openssl_random_pseudo_bytes(16);
    $aesEncrypted = openssl_encrypt($vigenereEncrypted, 'aes-256-cbc', $sharedKeyBinary, OPENSSL_RAW_DATA, $iv);
    $encodedAES = base64_encode($iv . $aesEncrypted);

    echo json_encode([
        'public_key' => $A,
        'shared_secret' => $S,
        'vigenere_key' => $vigenereKeyAlpha,
        'vigenere_encrypted' => $vigenereEncrypted,
        'aes_encrypted' => $encodedAES
    ]);
}

?>
