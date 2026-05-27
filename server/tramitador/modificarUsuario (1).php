<?php


$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


		$ID_USUARIO = $_POST["ID_USUARIO"];	
		$NOMBRE 	= $_POST["NOMBRE"];
		$EMAIL 		= $_POST["EMAIL"];
		$LOGIN 		= $_POST["LOGIN"];
		$PERFIL 	= $_POST["PERFIL"];
		

		/*Creamos una query sencilla*/
	


		$sql2="UPDATE `USUARIO` SET `NOMBRE`='$NOMBRE',
		`LOGIN`='$LOGIN', `PERFIL`='$PERFIL',`EMAIL`='$EMAIL' WHERE `ID` = $ID_USUARIO";

		
		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>USUARIO MODIFICADO CORRECTAMENTE</b></div>";

}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>