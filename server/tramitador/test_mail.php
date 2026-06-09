<?php
$email = isset($_POST['EMAIL']) ? trim($_POST['EMAIL']) : '';
$codigo = isset($_POST['CODIGO']) ? trim($_POST['CODIGO']) : '';

if ($email === '' || $codigo === '') {
    echo '<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Prueba de correo</title>
</head>
<body>
  <form method="post">
    <label for="EMAIL">Email:</label>
    <input type="email" id="EMAIL" name="EMAIL" value="' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '" required>
    <br><br>
    <label for="CODIGO">Código:</label>
    <input type="text" id="CODIGO" name="CODIGO" value="' . htmlspecialchars($codigo, ENT_QUOTES, 'UTF-8') . '" required>
    <br><br>
    <button type="submit">Enviar correo</button>
  </form>
</body>
</html>';
    exit;
}

$email_to = $email;
$email_subject = 'Recuperación de contraseña - Tramitador Exhorto';

$email_message = '
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div bgcolor="#ededed">
    <table border="0" cellspacing="0" bgcolor="#ededed" width="100%">
      <tbody>
        <tr>
          <td>
            <table border="0" cellpadding="0" cellspacing="0" align="center" width="600">
              <tbody>
                <tr>
                  <td bgcolor="#FFFFFF">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tbody>
                        <tr>
                          <td style="text-align:left;padding:10px 20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#003366">
                            <strong>Hola,</strong>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align:left;padding:0 20px 10px 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#003366">
                            <p style="color:rgb(0,51,102);font-size:11px;text-align:justify">
                              Para realizar el cambio de contraseña, presione el botón de más abajo.
                            </p>
                            <p style="font-size:11px">
                              <a href="https://tramitadorexhorto.cl/cambioContrasena.php?aut=' . htmlspecialchars($codigo, ENT_QUOTES, 'UTF-8') . '" style="color:rgb(0,81,255)" target="_blank">Presione aquí</a>
                            </p>
                            <p style="font-size:11px;color:rgb(0,51,102)">Código de autorización: <strong>' . htmlspecialchars($codigo, ENT_QUOTES, 'UTF-8') . '</strong></p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>';

$encabezado  = "MIME-Version: 1.0\r\n";
$encabezado .= "Content-type: text/html; charset=UTF-8\r\n";
$encabezado .= "From: Tramitador exhorto <no-reply@tramitadorexhorto.cl>\r\n";
$encabezado .= "Reply-To: no-reply@tramitadorexhorto.cl\r\n";

$enviado = mail($email_to, $email_subject, $email_message, $encabezado);

if ($enviado) {
    echo '<div class="alert alert-success"><b>Correo enviado</b> a ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . ' con el código ' . htmlspecialchars($codigo, ENT_QUOTES, 'UTF-8') . '.</div>';
} else {
    echo '<div class="alert alert-danger"><b>Error:</b> No se pudo enviar el correo.</div>';
}
