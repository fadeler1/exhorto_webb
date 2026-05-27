<?php


$servername = "localhost";
$username = "ctr17658";
$password = "P4MmL@]tXLEN:H$";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$NOMBRE 	= $_POST["NOMBRE"];
		$EMAIL 		= $_POST["EMAIL"];
		$LOGIN 		= $_POST["LOGIN"];
		$PERFIL 	= $_POST["PERFIL"];
		

		/*Creamos una query sencilla*/
	


		$sql2="INSERT INTO `USUARIO`(`ID`, `NOMBRE`, `LOGIN`, `PASSWORD`, `PERFIL`, `EMAIL`, `AUTORIZACION`) 
				VALUES (null,'$NOMBRE','$LOGIN','cambiar','$PERFIL','$EMAIL',0)";

		
		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>USUARIO INGRESADO CORRECTAMENTE</b></div>";

}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>