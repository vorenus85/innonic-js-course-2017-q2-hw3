<?php
$data = file_get_contents('php://input');
if (file_put_contents('../json/screening.json', $data)) {
    echo "JSON file modified successfully...";
} else {
    echo "Oops! Error...";
}

?>