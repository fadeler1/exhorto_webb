<?php
    $conexion = new mysqli('localhost','ctr17658','P4MmL@]tXLEN:H$','ctr17658_EXHORTO',3306);


	if (mysqli_connect_errno()) {
    	printf("La conexión con el servidor de base de datos falló: %s\n", mysqli_connect_error());
    	exit();
	}

$ciudadHonorario 	= $_GET["CIUDAD"];
$abogadohonorario	= $_GET["ABOGADO"];
$accion 			= $_GET["ACCION"];
$pendiente 			= $_GET["PENDIENTE"];
$pagada 			= $_GET["PAGADA"];
$ACCION_TIPO 		= $_GET["ACCION_TIPO"];
$caratula 			= $_GET["CARATULA"];
$EXHORTO 			= $_GET["EXHORTO"];


$where = "";
$querybuscador = "SELECT EX.ID,	APELLIDO_DEUDOR, NOMBRE_CLIENTE, ABOGADO, EX.ESTADO as ESTADO_EX, BOLETA_HONORARIOS, BOLETA_DEVOLUCION , BOL.ID as ID_BOLETA, 
						DOCUMENTO, MONTO, BOL.ESTADO, TIPO, PERTENECE, FECHA , EX.CIUDAD
 				from EXHORTO EX inner join BOLETA_HONORARIO BOL on (EX.ID = BOL.ID_EXHORTO) ";

if($ciudadHonorario != ""){ //deudor
	if(strlen($where) == 0){
		$where = $where." EX.CIUDAD like '%$ciudadHonorario%' ";
	}else{
		$where = $where." and EX.CIUDAD like '%$ciudadHonorario%'  ";
	}
	
}

if($caratula != ""){
	if(strlen($where) == 0){
		$where = $where." (EX.APELLIDO_DEUDOR like '%$caratula%' or EX.NOMBRE_CLIENTE like '%$caratula%') ";
	}else{
		$where = $where." and (EX.APELLIDO_DEUDOR like '%$caratula%' or EX.NOMBRE_CLIENTE like '%$caratula%')   ";
	}
}

if($abogadohonorario != ""){
	if(strlen($where) == 0){
		$where = $where." EX.ABOGADO like '%$abogadohonorario%' ";
	}else{
		$where = $where." and EX.ABOGADO like '%$abogadohonorario%'  ";
	}
}

if($ACCION_TIPO == "HONORARIOS"){
	if(strlen($where) == 0){
			$where = $where." BOL.TIPO  = 1 ";
		}else{
			$where = $where." and BOL.TIPO = 1  ";
		}
}else{
	if($ACCION_TIPO == "DEVOLUCION"){
		if(strlen($where) == 0){
			$where = $where." BOL.TIPO  = 2 ";
		}else{
			$where = $where." and BOL.TIPO = 2  ";
		}
	}
}

if($accion == "PENDIENTE"){
			if($pendiente == "PENDIENTE"){
		if(strlen($where) == 0){
			$where = $where." BOL.ESTADO  = 0 ";
		}else{
			$where = $where." and BOL.ESTADO = 0  ";
		}
	}		
}else{
	if($accion == "PAGADA"){
		if($pagada == "PAGADA"){
			if(strlen($where) == 0){
				$where = $where." BOL.ESTADO  = 1 ";
			}else{
				$where = $where." and BOL.ESTADO = 1  ";
			}
		}
	}
}

if(strlen($where) == 0){
	$querybuscador;
}else{
	$querybuscador = $querybuscador." WHERE ".$where." ";
	
}

if($EXHORTO != ""){

	$sqlDiligencias = "select ID_EXHORTO from DILIGENCIA where DILIGENCIA like  '%$EXHORTO%' or OBSERVACIONES like  '%$EXHORTO%'";

	$sqlFinal ="select A.ID,A.APELLIDO_DEUDOR, A.NOMBRE_CLIENTE, A.ABOGADO, A.ESTADO_EX, A.BOLETA_HONORARIOS, A.BOLETA_DEVOLUCION , A.ID_BOLETA, 
						A.DOCUMENTO, A.MONTO, A.ESTADO, A.TIPO, A.PERTENECE, FECHA, CIUDAD from (".$querybuscador.") as A inner join (".$sqlDiligencias.") as B on  (A.ID = B.id_exhorto)";

}else{
	$sqlFinal = $querybuscador;
}

	$resultado = $conexion->query($sqlFinal);

	

	if($resultado->num_rows > 0 ){
						
		date_default_timezone_set('America/Mexico_City');

		if (PHP_SAPI == 'cli')
			die('Este archivo solo se puede ver desde un navegador web');

		/** Se agrega la libreria PHPExcel */
		require_once 'lib/PHPExcel/PHPExcel.php';

		// Se crea el objeto PHPExcel
		$objPHPExcel = new PHPExcel();

		// Se asignan las propiedades del libro
		$objPHPExcel->getProperties()->setCreator("Tramitación Exhortos A & G Asociados") //Autor
							 ->setLastModifiedBy("Codedrinks") //Ultimo usuario que lo modificó
							 ->setTitle("Reporte Excel con PHP y MySQL")
							 ->setSubject("Reporte Excel con PHP y MySQL")
							 ->setDescription("Reporte de Tramitación Exhortos")
							 ->setKeywords("reporte Tramitación Exhortos")
							 ->setCategory("Reporte excel");

		$tituloReporte = "Boletas Tramitación Exhortos A & G Asociados";
		$titulosColumnas = array('CARATULA', 'CIUDAD', 'FECHA', 'BOLETA', 'MONTO', 'ABOGADO');
		
		$objPHPExcel->setActiveSheetIndex(0)
        		    ->mergeCells('A1:D1');
						
		// Se agregan los titulos del reporte
		$objPHPExcel->setActiveSheetIndex(0)
					->setCellValue('A1',$tituloReporte)
        		    ->setCellValue('A3',  $titulosColumnas[0])
		            ->setCellValue('B3',  $titulosColumnas[1])
        		    ->setCellValue('C3',  $titulosColumnas[2])
        		    ->setCellValue('D3',  $titulosColumnas[3])
        		    ->setCellValue('E3',  $titulosColumnas[4])
            		->setCellValue('F3',  $titulosColumnas[5]);
		
		//Se agregan los datos de los alumnos
		$i = 4;
		while ($fila = $resultado->fetch_array()) {

			$objPHPExcel->setActiveSheetIndex(0)
        		    ->setCellValue('A'.$i,  $fila[2]." /".$fila[1])
		            ->setCellValue('B'.$i,  $fila[14])
        		    ->setCellValue('C'.$i,  $fila[13])
            		->setCellValue('D'.$i, $fila[8])
            		->setCellValue('E'.$i,  $fila[9])
            		->setCellValue('F'.$i,  $fila[3]);


					$i++;
		}
		
		$estiloTituloReporte = array(
        	'font' => array(
	        	'name'      => 'Verdana',
    	        'bold'      => true,
        	    'italic'    => false,
                'strike'    => false,
               	'size' =>16,
	            	'color'     => array(
    	            	'rgb' => 'FFFFFF'
        	       	)
            ),
	        'fill' => array(
				'type'	=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'	=> array('argb' => 'FF220835')
			),
            'borders' => array(
               	'allborders' => array(
                	'style' => PHPExcel_Style_Border::BORDER_NONE                    
               	)
            ), 
            'alignment' =>  array(
        			'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
        			'vertical'   => PHPExcel_Style_Alignment::VERTICAL_CENTER,
        			'rotation'   => 0,
        			'wrap'          => TRUE
    		)
        );

		$estiloTituloColumnas = array(
            'font' => array(
                'name'      => 'Arial',
                'bold'      => true,                          
                'color'     => array(
                 'rgb' => 'FFFFFF'
                )
            ),
            'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_GRADIENT_LINEAR,
				
        		'startcolor' => array(
            		'rgb' => 'c47cf2'
        		),
        		'endcolor'   => array(
            		'argb' => 'FF431a5d'
        		)
			),
            'borders' => array(
            	'top'     => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM ,
                    'color' => array(
                        'rgb' => '143860'
                    )
                ),
                'bottom'     => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM ,
                    'color' => array(
                        'rgb' => '143860'
                    )
                )
            ),
			'alignment' =>  array(
        			'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
        			'vertical'   => PHPExcel_Style_Alignment::VERTICAL_CENTER,
        			'wrap'          => TRUE
    		));
			
		$estiloInformacion = new PHPExcel_Style();
		$estiloInformacion->applyFromArray(
			array(
           		'font' => array(
               	'name'      => 'Arial',               
               	'color'     => array(
                   	'rgb' => '000000'
               	)
           	),
           	'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFd9b7f4')
			),
           	'borders' => array(
               	'left'     => array(
                   	'style' => PHPExcel_Style_Border::BORDER_THIN ,
	                'color' => array(
    	            	'rgb' => '3a2a47'
                   	)
               	)             
           	)
        ));
		 
		$objPHPExcel->getActiveSheet()->getStyle('A1:F1')->applyFromArray($estiloTituloReporte);
		$objPHPExcel->getActiveSheet()->getStyle('A3:F3')->applyFromArray($estiloTituloColumnas);		
		//$objPHPExcel->getActiveSheet()->setSharedStyle($estiloInformacion, "A4:D".($i-1));
				
		for($i = 'A'; $i <= 'F'; $i++){
			$objPHPExcel->setActiveSheetIndex(0)			
				->getColumnDimension($i)->setAutoSize(TRUE);
		}
		
		// Se asigna el nombre a la hoja
		$objPHPExcel->getActiveSheet()->setTitle('BOLETAS');

		// Se activa la hoja para que sea la que se muestre cuando el archivo se abre
		$objPHPExcel->setActiveSheetIndex(0);
		// Inmovilizar paneles 
		//$objPHPExcel->getActiveSheet(0)->freezePane('A4');
		$objPHPExcel->getActiveSheet(0)->freezePaneByColumnAndRow(0,4);



		// Se manda el archivo al navegador web, con el nombre que se indica (Excel2007)
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;charset=iso-8859-1');
		header('Content-Disposition: attachment;filename="Boletas Tramitacion Exhortos.xlsx"');
		header('Cache-Control: max-age=0');

		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save('php://output');
		exit;
		
	}
	else{
		print_r('No hay resultados para mostrar');
	}
?>