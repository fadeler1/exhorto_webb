<?php



$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$ID_BOLETA_RECEPTOR 	= $_POST["ID_BOLETA_RECEPTOR"];
		

		/*Creamos una query sencilla*/
	
		$sql2="DELETE FROM `BOLETA_RECEPTOR` WHERE `ID` = $ID_BOLETA_RECEPTOR ";

		$result = mysql_query($querybuscador, $link);  

		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>BOLETA BOLETA_RECEPTOR ELIMINADA</b> Fue ingresado correctamente a la base de datos</div>";
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>