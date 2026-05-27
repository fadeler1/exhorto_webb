<?php

//tomamos los datos del archivo conexion.php  
include("conexion.php");  
$link = Conectarse();  

$id_exhorto_buscar 		= $_POST["ID_EXHORTO"];

$where = "";



$querybuscador = "SELECT `ID`, `ID_EXHORTO`, `DILIGENCIA`, `FECHA`, `OBSERVACIONES`, `USUARIO` FROM DILIGENCIA WHERE `ID_EXHORTO` = $id_exhorto_buscar";

	
//se envia la consulta  
$result = mysql_query($querybuscador, $link);  

$cantidadEncontradas = mysql_num_rows($result);
	
	echo "<table id=\"todo\" class=\"table table-hover custom-check\">";
                      echo "<tbody>";

                     while ($row = mysql_fetch_row($result)){   
                        echo "<tr>";
                         echo "<td IdDiligencia=\"".$row[0]."\" combo=\"".$row[2]."\" fecha=\"".$row[3]."\" obs=\"".$row[4]."\">";
                                echo "<span class=\"check\"></span>";
                                echo "<a href=\"#\"> ".$row[2]." </a>&nbsp;&nbsp; <b>".$row[3]."</b>&nbsp;&nbsp;&nbsp;&nbsp;<span>".$row[4]."</span>";
                                
                  		echo "</td>";
                        echo "</tr>";
                       
					}	  
		  



        echo "</tbody>";
		echo "</table>";  


?>