// ==UserScript==
// @name     Import-to-noskrien
// @version  1
// @grant GM.xmlHttpRequest
// @include http://www.noskrien.lv/wp-content/plugins/noskrien.lv/ajax_noskrietais.php
// @require https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

$("#labot_forma").append("<div id='response'/>");

function save_run()
{
  $.ajax({
    type: 'POST',
    url: 'http://www.noskrien.lv/wp-content/plugins/noskrien.lv/ajax_noskrietais.php?dir=saglabat&id='+unsafeWindow.last_id+'&user_id='+unsafeWindow.user_id,
    data: $("#labot_forma").serialize(), 
    success: function(response) { $("#response").html(JSON.parse(response).html); }
  });
}

function fill_run(data)
{
	$("#inp_distance").val(data.distance); 
	$(".pulss").val(data.average_hr);     
	var dur = data.duration;          
	var measuredTime = new Date(null);
	measuredTime.setSeconds(Math.round(dur)); 
	var MHSTime = measuredTime.toISOString().substr(11, 8);	      
	$("#inp_ilgums").val(MHSTime);   
	$(".piezimes").val(data.notes);
	var lt = data.start_time;
	var dd = lt.substring(8, 10) + "/" + lt.substring(5, 7) + "/" + lt.substring(0, 4);
	$(".nosaukums").val("Skrējiens " + dd + " " + lt.substring(11, 19));
	$("#datepicker").val(dd);  
}


$(".skrejiens_labot").prepend("Garmin URL:<input size='100' type='text' id='garmin_link'><input type='button' id='parse_garmin' value='Load from Garmin Connect'><br/>");
$("#parse_garmin").click(function(){
	var a = $("#garmin_link").val().split("/");
	var id = a[a.length - 1];
	var url = "https://connect.garmin.com/modern/proxy/activity-service/activity/" + id;
	GM.xmlHttpRequest({
  			method: "GET",
  			url: url,
  			headers: {
    			"NK": "NT"           
  			},    
  			onload: function(response) {
				var o = JSON.parse(response.responseText).summaryDTO;
				fill_run({
					distance: o.distance/1000,
					average_hr: o.averageHR,
					duration: o.duration,
					notes: $("#garmin_link").val(),
					start_time: o.startTimeLocal
				});
				save_run();
			}
		});
});
