<?php  
function Conectarse()  
{  
   if (!($link=mysql_connect("localhost","ctr17658","QKhjLENOdhvhSLUJDbEn")))  
   {  
      echo "Error conectando a la base de datos.";  
      exit();  
   }  
   if (!mysql_select_db("ctr17658_EXHORTO",$link))  
   {  
      echo "Error seleccionando la base de datos.";  
      exit();  
   }  
   return $link;  
}  
?>  