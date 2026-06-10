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
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #ededed;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table { border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0; }
    .email-code {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #0d2142;
      font-family: Consolas, Monaco, "Courier New", monospace;
      line-height: 1.3;
      word-break: break-word;
    }
    .email-body-text {
      margin: 0 0 18px;
      font-size: 14px;
      line-height: 1.55;
      color: #334155;
      text-align: left;
    }
  </style>
  <style type="text/css">
    @media only screen and (max-width: 480px) {
      .email-outer-pad { padding: 14px 8px !important; }
      .email-header-pad { padding: 16px 16px !important; }
      .email-inner-pad { padding: 18px 16px !important; }
      .email-footer-pad { padding: 12px 16px !important; }
      .email-title { font-size: 17px !important; line-height: 1.3 !important; }
      .email-code-box { padding: 14px 10px !important; }
      .email-code { font-size: 22px !important; letter-spacing: 0.08em !important; }
      .email-code-label { font-size: 11px !important; letter-spacing: 0.05em !important; }
    }
    @media only screen and (min-width: 481px) {
      .email-body-text { font-size: 13px; text-align: justify; }
      .email-code { font-size: 32px; letter-spacing: 0.28em; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#ededed;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ededed">
    <tr>
      <td align="center" class="email-outer-pad" style="padding:24px 12px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td class="email-header-pad" style="padding:20px 24px;background:linear-gradient(145deg,#081428 0%,#0d2142 55%,#132a52 100%);">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#eb5e28;">
                A &amp; G Asociados
              </p>
              <h1 class="email-title" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:700;line-height:1.25;color:#ffffff;">
                Recuperación de contraseña
              </h1>
            </td>
          </tr>
          <tr>
            <td class="email-inner-pad" style="padding:24px;font-family:Arial,Helvetica,sans-serif;color:#003366;">
              <p style="margin:0 0 12px;font-size:14px;line-height:1.5;">
                <strong>Hola,</strong>
              </p>
              <p class="email-body-text">
                Recibimos una solicitud para restablecer tu contraseña. Ingresa el siguiente código
                en la pantalla de recuperación de la aplicación.
              </p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" class="email-code-box" style="padding:16px 12px;background-color:#f4f6fa;border:1px solid #dce3ee;border-radius:8px;">
                    <p class="email-code-label" style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#5c6578;">
                      Tu código de verificación
                    </p>
                    <p class="email-code">
                      ' . $codigo_html . '
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:#64748b;">
                Si no solicitaste este cambio, ignora este mensaje. El código es de un solo uso.
              </p>
            </td>
          </tr>
          <tr>
            <td class="email-footer-pad" style="padding:14px 24px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
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
