<?php


$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$id 	= $_POST["ID_EXHORTO"];
		
		

		/*Creamos una query sencilla*/
	


		$sql2="DELETE FROM `EXHORTO` WHERE `ID` = $id ";

		
		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>EXHOTO ELIMINADO CORRECTAMENTE</b></div>";

}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>