<?php
	header("Content-Type:application/json");

	$authors = array(
		"0" => array(
			"name"=> "Andy",
			"age"=> "14"
		),
		"1" => array(
			"name"=> "Bob",
			"age"=> "24"
		)
	);

	$returnArray = array(
		"status" => 200,
		"message" => "Authors fetched",
		"authors"=> $authors
	);

	//http_send_status(200);

	echo json_encode($returnArray);
	http_response_code(200);