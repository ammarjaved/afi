


<?php
include("connection.php");

class HighRise extends connection {
    function __construct()
    {
        $this->connectionDB();

    }

    public function getHighRise() {
        $gid=$_REQUEST['gid'];
       
            $sql = "select * from dp_high_rise where gid=$gid";
        

        $output = array();
        $result_query = pg_query($sql);
        if ($result_query) {
             $arrq = pg_fetch_all($result_query);
             // print_r($arrq);
             // exit();
             $output=json_encode($arrq);
                   
        }
$this->closeConnection();
        return $output;

        
    }
}

$json = new HighRise();
//$json->closeConnection();
echo $json->getHighRise();

