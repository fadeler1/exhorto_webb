<?php
session_start();

$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


		$ID 				= $_POST["ID"];	
		$apellidodeudor 	= $_POST["apellidodeudor"];
		$nombrecliente 		= $_POST["nombrecliente"];
		$rut_cliente 		= $_POST["rut_cliente"];
		$tribunalorigen 	= $_POST["tribunalorigen"];
		$roljuicio 			= $_POST["roljuicio"];
		$ciudadexhorto 		= $_POST["ciudadexhorto"];
		$falcultadesexhor 	= $_POST["falcultadesexhor"];
		$abogadoexhor 		= $_POST["abogadoexhor"];
		$usuario 			= $_SESSION['usuario'];
		/*Creamos una query sencilla*/
		
		$sql2="UPDATE `EXHORTO` SET `APELLIDO_DEUDOR`='$apellidodeudor',`NOMBRE_CLIENTE`='$nombrecliente', `TRIBUNAL_ORIGEN`='$tribunalorigen',
		`ROL_JUICIO`='$roljuicio',`CIUDAD`='$ciudadexhorto',`FACULTADES`='$falcultadesexhor',`ABOGADO`='$abogadoexhor'  WHERE  ID = $ID";
		
		
		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>Exhorto </b> Fue modificado correctamente a la base de datos</div>";
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>