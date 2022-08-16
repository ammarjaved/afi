<?php
include '../connection.php';
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
// $output = array();




	$users =  pg_query("SELECT  l1_id from fpl1 where l1_id in (select distinct l1_id from dp_submitted)");
		$user = pg_fetch_all($users);

	  $GLOBALS['recursive']=0;
	   $len=sizeof($user);
       create_excel($user[$GLOBALS['recursive']]['l1_id'],$user,$len);
           
			
			
			function create_excel($perm,$user,$len){
								//echo $GLOBALS['recursive'];

				$reader = new PhpOffice\PhpSpreadsheet\Reader\Xlsx();
				$spreadsheet = $reader->load("afi_data.xlsx");
				$users_2=	pg_query("SELECT * from fpl1 where l1_id='$perm'");
				
				$spreadsheet->setActiveSheetIndex(0)
				->getStyle('C7:L7')->getFill()
			                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
			                ->getStartColor()->setARGB('99999999');
                  $spreadsheet->getActiveSheet()->setTitle($perm);
				$pe_name='';  
				while($user_2 = pg_fetch_object($users_2)):
			
				$spreadsheet->setActiveSheetIndex(0)
				    ->setCellValue('H2', $user_2->pe_name)
				    ->setCellValue('H3', $user_2->l1_id)
				    ->setCellValue('H4', $user_2->pe_fl);

					$cell = "C";
					$pe_name=clean($user_2->pe_name);
				for ($i=1; $i <11 ; $i++) { 
				

					$name = "lvf".$i."_fd";
					$cel_no = $cell."8";
					$cel_no1 = $cell."9";

				
					$spreadsheet->setActiveSheetIndex(0)
				    ->setCellValue($cel_no, $user_2->$name);
					$cell++;
				}
				$users_3 = pg_query("SELECT count(*) from dp_submitted where l1_id='".$user[$GLOBALS['recursive']]['l1_id']."' and COALESCE(l2_id,'') in ('','null')");
		
				while($user_3 = pg_fetch_object($users_3)):
 					$spreadsheet->setActiveSheetIndex(0)
    					->setCellValue('H5', $user_3->count);

				endwhile;
				
				$users_44 = pg_query("SELECT count(*) from dp_submitted where l1_id='".$user[$GLOBALS['recursive']]['l1_id']."'");
		
				while($user_44 = pg_fetch_object($users_44)):
 					$spreadsheet->setActiveSheetIndex(0)
    					->setCellValue('H6', $user_44->count);

				endwhile;






			
					$id = $user_2->l1_id;
					
			   $q ="SELECT count(*),phase, fd_no from dp_submitted where l1_id='$id' and COALESCE(l2_id,'') in ('','null') group by phase, fd_no order by fd_no";
//echo $q;

				$query_4 = pg_query($q);
			
				

				$data;
				$col_no= '9';
				$pre = 0;
				$sum = 0;
                $totalsum=[];
				while($query = pg_fetch_object($query_4)):

					$col = 'C';

					for ($i=0; $i <$query->fd_no-1 ; $i++) { 
						$col++;
					}
					if ($pre != $query->fd_no) {
						 $totalsum=[];			
						$col_no = '9';
						for ($d=9; $d <13 ; $d++) { 
							# code...
							$spreadsheet->setActiveSheetIndex(0)
				    			->setCellValue($col.$d,"0" );

						}
									
					}
					$pre= $query->fd_no;
					

						$cell_num = $col.$col_no;
					
					

					if ($query->phase == "R") {
							$data = "RED [".$query->count."]";
							$spreadsheet->setActiveSheetIndex(0)
				    			->setCellValue($col."9",$data );
				    			$col_no++;
								//echo $query->count;
								array_push($totalsum,(int)$query->count);


					}elseif($query->phase == "Y"){
						$data = "YELLOW [".$query->count."]";
							$spreadsheet->setActiveSheetIndex(0)
				    			->setCellValue($col."10",$data );
				    			$col_no++;
								//echo $query->count;
								array_push($totalsum,(int)$query->count);


					}elseif ($query->phase == "B") {
						# code...
						$data = "BLUE [".$query->count."]";
							$spreadsheet->setActiveSheetIndex(0)
				    			->setCellValue($col."11",$data );
								//echo $query->count;
							array_push($totalsum,(int)$query->count);
				    			$col_no++;
					}elseif ($query->phase=="RYB") {
						# code...
						$data = "RYB [".$query->count."]";
							$spreadsheet->setActiveSheetIndex(0)
				    			->setCellValue($col."12",$data );
				    			$col_no++;
							//echo $query->count;
								array_push($totalsum,(int)$query->count);
					}
//exit();

			//print_r($totalsum);
	   // exit();				
			      $spreadsheet->setActiveSheetIndex(0)
				    			->setCellValue($col.'14',"Total: ".array_sum($totalsum));
				//$totalsum=[];				








				endwhile;

				


  			
			endwhile;

			
			
				$writer = new Xlsx($spreadsheet);	
				$writer->save($pe_name.'_'.$user[$GLOBALS['recursive']]['l1_id'].'.xlsx');
	         
				create_excel_sfp($user[$GLOBALS['recursive']]['l1_id'],$pe_name);
				//$writer->save($user[$GLOBALS['recursive']]['pe_name'].'.xlsx');
				
			    $GLOBALS['recursive']=$GLOBALS['recursive']+1;
				
				if($GLOBALS['recursive']<$len){
					create_excel($user[$GLOBALS['recursive']]['l1_id'],$user,$len);
				}else{
					exit();
				}
			}


function clean($string) {
   $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

   return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}
  

	function create_excel_sfp($perm,$pe_name){
		//echo $perm;
		//exit();
		  $users =  pg_query("SELECT  l2_id from sfp_l2 where l1_id='".$perm."'");
		
		  if(pg_num_rows($users)!=0){
			
		  $user = pg_fetch_all($users);
		 // print_r($user);
		
	      $len=sizeof($user);
		  //echo $len;
          //create_excel_sfp($user[$GLOBALS['recursive']]['l1_id'],$user,$len);
		  
				
		       $m=0; 
			for($i=0;$i<$len;$i++){	
				$reader = new PhpOffice\PhpSpreadsheet\Reader\Xlsx();
				$spreadsheet = $reader->load($pe_name.'_'.$perm.'.xlsx');
				
				$sql="SELECT * from sfp_l2 where l2_id='".$user[$i]['l2_id']."'";
				//echo $sql;
				// $spreadsheet->getActiveSheet()->setTitle($user[$i]['l2_id']);
				 
				$users_2=	pg_query($sql);
				
			    $m=$m+1; 
    			 $k=$m;
				 echo $m;
				$spreadsheet->createSheet();
    			 $spreadsheet->setActiveSheetIndex($m);
				 foreach (range('C', 'L') as $letra) {    
				 $spreadsheet->getActiveSheet()->getColumnDimension($letra)->setWidth(120, 'pt');
				 }
				 
				  $spreadsheet->getActiveSheet()->setTitle($user[$i]['l2_id']);
				  $writer = new Xlsx($spreadsheet);	
				  $writer->save($pe_name.'_'.$perm.'.xlsx');
				  $spreadsheet = $reader->load($pe_name.'_'.$perm.'.xlsx');

				while($user_2 = pg_fetch_object($users_2)):
				  
			    
				$spreadsheet->setActiveSheetIndex($k)
					->setCellValue('G2','PE Name')
				    ->setCellValue('G3', 'FP No.')
					->setCellValue('G4', 'SFP No')	
				    ->setCellValue('G5', 'Transformer Capacity')
					
				    ->setCellValue('H2', $user_2->pe_name)
				    ->setCellValue('H3', $user_2->l1_id)
					->setCellValue('H4', $user_2->l2_id)
				    ->setCellValue('H5', $user_2->pe_fl);
					
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G2' )->getFont()->setBold( true );
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G3' )->getFont()->setBold( true );
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G4' )->getFont()->setBold( true );
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G5' )->getFont()->setBold( true );
					
					$cell = "C";
				for ($p=1; $p <11 ; $p++) {     	//Start For loop
						
							$name = "lvf".$p."_fd";
							$cel_no = $cell."7";
							$cel_no1 = $cell."8";
						// $spreadsheet->setValignment('center');
							$spreadsheet->setActiveSheetIndex($k)
							->setCellValue($cel_no, "F".$p)
						    ->setCellValue($cel_no1, $user_2->$name);
						    $spreadsheet->setActiveSheetIndex($k)
						    ->getStyle('C7:L7')->getFill()
			                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
			                ->getStartColor()->setARGB('99999999');
			               
			                

						    $cell++;
						}	
					
				/*for ($j=1; $j <11 ; $j++) { 
				

					$name = "lvf".$j."_fd";
					$cel_no = $cell."8";
					$cel_no1 = $cell."9";

				
					$spreadsheet->setActiveSheetIndex($k)
				    ->setCellValue($cel_no, $user_2->$name);
					$cell++;
				}*/
				$spreadsheet->setActiveSheetIndex($k)
					->getStyle('C7:L7')->getAlignment()->setHorizontal('center');
					
					$styleArray = array(
					'borders' => array(
						'outline' => array(
							'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
							'color' => array('argb' => '000000'),
						),
						'right' => array(
							'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
							'color' => array('argb' => '000000'),
						),
					),
				);

				$spreadsheet->setActiveSheetIndex($k)->getStyle('C7:L7')->applyFromArray($styleArray);
					
				$users_3 = pg_query("SELECT count(*) from dp_submitted where l2_id='".$user[$i]['l2_id']."' and COALESCE(l3_id,'') in ('','null')");
		
				while($user_3 = pg_fetch_object($users_3)):
 					$spreadsheet->setActiveSheetIndex($k)
					     ->setCellValue('G6', 'Total count')
    					->setCellValue('H6', $user_3->count);

				endwhile;
				$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G6' )->getFont()->setBold( true );

					$id = $user_2->l2_id;
					
			   $q ="SELECT count(*),phase, fd_no from dp_submitted where l2_id='$id' and COALESCE(l3_id,'') in ('','null') group by phase, fd_no order by fd_no ";

				$query_4 = pg_query($q);
			
				

				$data;
				$col_no= '9';
				$pre = 0;
				$sum = 0;
				$totalsum=[];
				while($query = pg_fetch_object($query_4)):

					$col = 'C';
					for ($g=0; $g <$query->fd_no-1 ; $g++) { 
						$col++;
					}

					if ($pre != $query->fd_no) {	
						$totalsum=[];					
						$col_no = '9';
						for ($d=9; $d < 13; $d++) { 
							# code...
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col.$d,"0" );

						}
					}
					
					

						$cell_num = $col.$col_no;

					if ($query->phase == "R") {
							$data = "RED [".$query->count."]";
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col."9",$data );
								array_push($totalsum,(int)$query->count);
				    			$col_no++;


					}elseif($query->phase == "Y"){
						$data = "YELLOW [".$query->count."]";
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col."10",$data );
								array_push($totalsum,(int)$query->count);

				    			$col_no++;


					}elseif ($query->phase == "B") {
						# code...
						$data = "BLUE [".$query->count."]";
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col."11",$data );
								array_push($totalsum,(int)$query->count);
				    			$col_no++;
								
					}elseif ($query->phase=="RYB") {
						# code...
						$data = "RYB [".$query->count."]";
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col."12",$data );
								array_push($totalsum,(int)$query->count);
				    			$col_no++;
					}

					
			

				$pre= $query->fd_no;
				 $spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col.'14',"Total :".array_sum($totalsum));

				endwhile;		
				endwhile;

			
			
				$writer = new Xlsx($spreadsheet);	
				$writer->save($pe_name.'_'.$perm.'.xlsx');
				
				//$writer->save($user[$GLOBALS['recursive']]['pe_name'].'.xlsx');
			}
			    //$GLOBALS['recursive']=$GLOBALS['recursive']+1;
				
				//if($GLOBALS['recursive']<$len){
					//create_excel($user[$GLOBALS['recursive']]['l1_id'],$user,$len);
				//}else{
				//	exit();
				//}
				$filename=$pe_name.'_'.$perm;
				create_excel_mfp($user,$len,$filename);
				
		  }
			}		


	function create_excel_mfp($perm,$l,$name_file){
		//echo $perm;
		//exit();
		$m=$l;
		for($n=0;$n<$l;$n++){
		  $sql_q="SELECT  l3_id from mfp_l3 where l2_id='".$perm[$n]['l2_id']."'"; 	
		//  echo $sql_q;
		  $users =  pg_query($sql_q);
		  
		  
		
		  if(pg_num_rows($users)!=0){
			
		  $user = pg_fetch_all($users);
		 // print_r($user);
		
	      $len=sizeof($user);
          //create_excel_sfp($user[$GLOBALS['recursive']]['l1_id'],$user,$len);
		  $reader = new PhpOffice\PhpSpreadsheet\Reader\Xlsx();
				
		        
			for($i=0;$i<$len;$i++){	
				
				$spreadsheet = $reader->load("$name_file.xlsx");
				$sql_mfp="SELECT * from mfp_l3 where l3_id='".$user[$i]['l3_id']."'";
				//echo $sql_mfp;
				$users_2=	pg_query($sql_mfp);
				
				

				while($user_2 = pg_fetch_object($users_2)):
				  
				
				  //print_r($sheet_no);
				 
				 // exit();
				 $m=$m+1;
				 // echo $m;
			      $spreadsheet->createSheet();
    			 $spreadsheet->setActiveSheetIndex($m);
				  $spreadsheet->getActiveSheet()->setTitle($user[$i]['l3_id']);
				  $writer = new Xlsx($spreadsheet);	
				  $writer->save($name_file.'.xlsx');
				  $spreadsheet = $reader->load("$name_file.xlsx");
			     $k= $m;
				// echo $k;
				$spreadsheet->setActiveSheetIndex($k)
					->setCellValue('G2','PE Name')
				    ->setCellValue('G3', 'FP No.')
					->setCellValue('G4', 'SFP No')
					->setCellValue('G5', 'MFP No')
				    ->setCellValue('G6', 'Transformer Capacity')
				    ->setCellValue('H2', $user_2->pe_name)
				    ->setCellValue('H3', $user_2->l1_id)
					->setCellValue('H4', $user_2->l2_id)
					->setCellValue('H5', $user_2->l3_id)
				    ->setCellValue('H6', $user_2->pe_fl);
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G2' )->getFont()->setBold( true );
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G3' )->getFont()->setBold( true );
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G4' )->getFont()->setBold( true );
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G5' )->getFont()->setBold( true );
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G6' )->getFont()->setBold( true );

					$cell = "C";
					for ($p=1; $p <11 ; $p++) {     	//Start For loop
						
							$name = "lvf".$p."_fd";
							$cel_no = $cell."8";
							$cel_no1 = $cell."9";
						// $spreadsheet->setValignment('center');
							$spreadsheet->setActiveSheetIndex($k)
							->setCellValue($cel_no, "F".$p)
						    ->setCellValue($cel_no1, $user_2->$name);
						    $spreadsheet->setActiveSheetIndex($k)
						    ->getStyle('C8:L8')->getFill()
			                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
			                ->getStartColor()->setARGB('99999999');
			               
			                

						    $cell++;
						}	
						
						$spreadsheet->setActiveSheetIndex($k)
					->getStyle('C8:L8')->getAlignment()->setHorizontal('center');
					$styleArray = array(
					'borders' => array(
						'outline' => array(
							'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
							'color' => array('argb' => '000000'),
						),
					),
				);

				$spreadsheet->setActiveSheetIndex($k)->getStyle('C8:L8')->applyFromArray($styleArray);
				/*for ($j=1; $j <11 ; $j++) { 
				

					$name = "lvf".$j."_fd";
					$cel_no = $cell."10";
					$cel_no1 = $cell."11";

				
					$spreadsheet->setActiveSheetIndex($k)
				    ->setCellValue($cel_no, $user_2->$name);
					$cell++;
				}*/
				 foreach (range('C', 'L') as $letra) {    
				 $spreadsheet->getActiveSheet()->getColumnDimension($letra)->setWidth(120, 'pt');
				 }
				$users_3 = pg_query("SELECT count(*) from dp_submitted where l3_id='".$user[$i]['l3_id']."'");
		
				while($user_3 = pg_fetch_object($users_3)):
 					$spreadsheet->setActiveSheetIndex($k)
					     ->setCellValue('G7', 'Total count')
    					->setCellValue('H7', $user_3->count);

				endwhile;
					$spreadsheet->setActiveSheetIndex($k)
					->getStyle( 'G7' )->getFont()->setBold( true );

					$id = $user_2->l2_id;
					
			   $q ="SELECT count(*),phase, fd_no from dp_submitted where l3_id='".$user[$i]['l3_id']."' group by phase, fd_no order by fd_no ";

				$query_4 = pg_query($q);
			
				

				$data;
				$col_no= '10';
				$pre = 0;
				$sum = 0;
				$totalsum=[];
				while($query = pg_fetch_object($query_4)):

					$col = 'C';

					for ($d=0; $d <$query->fd_no-1 ; $d++) { 
						$col++;
					}
					if ($pre != $query->fd_no) {
									
						$col_no = '10';
						$totalsum=[];

						for ($d=10; $d < 14; $d++) { 
									$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col.$d,"0" );
								}		
									
					}
					
					

						$cell_num = $col.$col_no;

					if ($query->phase == "R") {
							$data = "RED [".$query->count."]";
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col."10",$data );
								array_push($totalsum,(int)$query->count);
				    			$col_no++;


					}elseif($query->phase == "Y"){
						$data = "YELLOW [".$query->count."]";
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col."11",$data );
								array_push($totalsum,(int)$query->count);
				    			$col_no++;


					}elseif ($query->phase == "B") {
						# code...
						$data = "BLUE [".$query->count."]";
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col."12",$data );
								array_push($totalsum,(int)$query->count);
				    			$col_no++;
					}elseif ($query->phase=="RYB") {
						# code...
						$data = "RYB [".$query->count."]";
							$spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col."13",$data );
								array_push($totalsum,(int)$query->count);
				    			$col_no++;
					}

					
			

				$pre= $query->fd_no;
				 $spreadsheet->setActiveSheetIndex($k)
				    			->setCellValue($col.'15','Total: '.array_sum($totalsum));

				endwhile;		
			endwhile;

			
			
				$writer = new Xlsx($spreadsheet);	
				$writer->save($name_file.'.xlsx');
				//$writer->save($user[$GLOBALS['recursive']]['pe_name'].'.xlsx');
			}
			    //$GLOBALS['recursive']=$GLOBALS['recursive']+1;
				
				//if($GLOBALS['recursive']<$len){
					//create_excel($user[$GLOBALS['recursive']]['l1_id'],$user,$len);
				//}else{
				//	exit();
				//}
		  }
		}
			}			

			//	die();
	//	endwhile;

?>