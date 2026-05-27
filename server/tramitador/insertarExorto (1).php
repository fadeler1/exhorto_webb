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
		
		$sql2="INSERT INTO EXHORTO(`ID`, `APELLIDO_DEUDOR`, `NOMBRE_CLIENTE`,  `TRIBUNAL_ORIGEN`, `ROL_JUICIO`, `CIUDAD`, `FACULTADES`, `ABOGADO`, `USUARIO`, `ESTADO` , `BOLETA_HONORARIOS` ) 
				VALUES (null,'$apellidodeudor','$nombrecliente','$tribunalorigen' ,'$roljuicio','$ciudadexhorto','$falcultadesexhor','$abogadoexhor' , '$usuario', 1, 0)";

		
		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>Exhorto $roljuicio</b> Fue ingresado correctamente a la base de datos</div>";
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>