<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $action = $_POST["action"];

    if ($action === "save") {
        $_SESSION["encrypted_text"] = $_POST["encrypted_text"];
        $_SESSION["key"] = $_POST["key"];
        $_SESSION["alphabet"] = $_POST["alphabet"];
        echo "Data saved to session.";
    } elseif ($action === "load") {
        $response = [
            "encrypted_text" => $_SESSION["encrypted_text"] ?? "",
            "key" => $_SESSION["key"] ?? "",
            "alphabet" => $_SESSION["alphabet"] ?? ""
        ];
        echo json_encode($response);
    }
}
?>
