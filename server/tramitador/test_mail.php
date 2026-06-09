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
$email_subject = 'Código de recuperación - Tramitador Exhorto';
$codigo_html = htmlspecialchars($codigo, ENT_QUOTES, 'UTF-8');

$email_message = '
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de contraseña</title>
</head>
<body style="margin:0;padding:0;background-color:#ededed;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ededed">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;background:linear-gradient(145deg,#081428 0%,#0d2142 55%,#132a52 100%);">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#eb5e28;">
                A &amp; G Asociados
              </p>
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;color:#ffffff;">
                Recuperación de contraseña
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;font-family:Arial,Helvetica,sans-serif;color:#003366;">
              <p style="margin:0 0 12px;font-size:14px;line-height:1.5;">
                <strong>Hola,</strong>
              </p>
              <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#334155;text-align:justify;">
                Recibimos una solicitud para restablecer tu contraseña. Ingresa el siguiente código
                en la pantalla de recuperación de la aplicación.
              </p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:16px 12px;background-color:#f4f6fa;border:1px solid #dce3ee;border-radius:8px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#5c6578;">
                      Tu código de verificación
                    </p>
                    <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:0.35em;color:#0d2142;font-family:Consolas,Monaco,monospace;">
                      ' . $codigo_html . '
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#64748b;">
                Si no solicitaste este cambio, ignora este mensaje. El código es de un solo uso.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 24px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.4;color:#94a3b8;text-align:center;">
                Tramitador Exhorto · Mensaje automático, no responder
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
