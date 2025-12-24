<?php
// Conexión con la base de datos
$conexion = new mysqli("localhost", "root", "", "conservardb");

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Capturar datos del formulario
$nombre = $_POST['Nombre'];
$correo = $_POST['correo'];
$contrasena = $_POST['Contraseña'];

// Encriptar la contraseña
$contrasena_segura = password_hash($contrasena, PASSWORD_DEFAULT);

// Insertar datos
$sql = "INSERT INTO usuarios (nombre, correo, contrasena) VALUES ('$nombre', '$correo', '$contrasena_segura')";

if ($conexion->query($sql) === TRUE) {
    echo "<script>
        alert('Registro exitoso');
        window.location.href='index.html';
    </script>";
} else {
    echo "Error: " . $sql . "<br>" . $conexion->error;
}

$conexion->close();
?>