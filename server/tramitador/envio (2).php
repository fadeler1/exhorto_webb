<?php
//tomamos los datos del archivo conexion.php  
include("conexion.php");  
$link = Conectarse();  


$servername = "localhost";
$username = "ctr17658";
$password = "P4MmL@]tXLEN:H$";
$dbname = "ctr17658_EXHORTO";


$email 	= $_POST["EMAIL"];


$n = rand(0,100000);


$query = "SELECT *  FROM `USUARIO` WHERE EMAIL = '$email'";

//se envia la consulta  
$result = mysql_query($query, $link);  
						  
$cantidad =  mysql_num_rows($result);

if($cantidad > 0){

	while ($row = mysql_fetch_row($result)){   
		
		// Debes editar las próximas dos líneas de código de acuerdo con tus preferencias
		$email_to = $email;
		$email_subject = "info@tramitadorexhorto.cl";


		/*// Aquí se deberían validar los datos ingresados por el usuario
		if(!isset($_POST['first_name']) ||
		!isset($_POST['last_name']) ||
		!isset($_POST['email']) ||
		!isset($_POST['telephone']) ||
		!isset($_POST['comments'])) {

		echo "<b>Ocurrió un error y el formulario no ha sido enviado. </b><br />";
		echo "Por favor, vuelva atrás y verifique la información ingresada<br />";
		die();
		}*/
		

		$email_message = '
		<!DOCTYPE html>
		<html lang="en">
		  <head>
		    <meta charset="utf-8">
		    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		    <meta name="description" content="">
		    <meta name="author" content="Dashboard">
		    <meta name="keyword" content="Dashboard, Bootstrap, Admin, Template, Theme, Responsive, Fluid, Retina"></head>

		<body>
		   <div bgcolor="#ededed"><table style="border:0px;padding:0px;margin:0px;float:left" cellpadding="0" cellspacing="0">
		<tbody><tr><td style="font-size:1px;line-height:1px;padding:0px" height="1"></td></tr></tbody></table>
		<table border="0" cellspacing="0" bgcolor="#ededed" width="100%">
		   <tbody>
		      <tr>
		         <td>
		         <table border="0" cellpadding="0" cellspacing="0" align="center" width="600">
		            <tbody>
		               <tr>
		                  <td>



		<table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#ffffff" width="100%">
		   <tbody>
		      

		   </tbody>
		</table>
		</td>
		               </tr>
		               
		               <tr>
		                  <td bgcolor="#FFFFFF">
		<table border="0" cellpadding="0" cellspacing="0" width="100%">
		   <tbody>
		      <tr>
		         <td style="text-align:left;padding:10px 20px 10px 20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#003366;background-color:#ffffff"><strong>Hola '.$row[1].',</strong></td>
		      </tr>
		      <tr>
		         <td style="text-align:left;padding:0px 20px 10px 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#003366;background-color:#ffffff">
		         <p style="color:rgb(0,51,102);font-family:Arial,Helvetica,sans-serif;font-size:11px;text-align:justify">
		            Para realizar el cambio de contraseña, debe presionar el boton de mas abajo para realizar el cambio.
		         </p>

		         <p style="color:rgb(0,51,102);font-family:Arial,Helvetica,sans-serif;font-size:11px"><a href="tramitadorexhorto.cl/cambioContrasena.php?aut='.$n.'" style="color:rgb(0,81,255)" target="_blank">Presione aquí</a>
		         </p>
		         </td>
		      </tr>
		      <tr>
		         <td style="text-align:left;padding:0px 20px 5px 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#003366;background-color:#ffffff"></td>
		      </tr>
		   </tbody>
		</table></td>
		          
		            </tbody>
		         </table>
		         </td>
		      </tr>
		   </tbody>
		</table>
		</div></body></html>';


		// Ahora se envía el e-mail usando la función mail() de PHP
		$encabezado = "MINE-Version: 1.0\r\n";
		$encabezado .= "Content-type: text/html; charset=UTF-8\r\n";
		$encabezado .= "From: Tramitador exhorto <no-reply@tramitadorexhorto.cl/>\r\n";
		$encabezado .= "Reply-To: no-reply@tramitadorexhorto.cl\r\n";

		@mail($email_to, $email_subject, $email_message, $encabezado);

		
		try {
			  // Create connection
				$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


		$sql2="UPDATE `USUARIO` SET `AUTORIZACION`=$n WHERE `EMAIL` = '$email'";

		
		 $conn->exec($sql2);

		}catch(PDOException $e){
			 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
		}

	}



	echo "<div class=\"alert alert-success\"><b>Correo existe en la base de datos</b><br>se enviara un correo con el link correspondiente.</div>";

}else{
	echo " <div class=\"alert alert-danger\"><b>No esta registrado con ese email</b> favor contactarse con el Administrador del sitio.</div>";
}



?>