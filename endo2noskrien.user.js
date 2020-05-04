// ==UserScript==
// @name     Endo-to-noskrien
// @version  1
// @grant GM.xmlHttpRequest
// @include http://www.noskrien.lv/wp-content/plugins/noskrien.lv/ajax_noskrietais.php
// @require https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

$(".skrejiens_labot").prepend("Endo URL:<input size='100' type='text' id='endo_link'><input type='button' id='parse_endo' value='Load from endo'><br/>");
$("#parse_endo").click(function(){
	GM.xmlHttpRequest({
  			method: "GET",
  			url: $("#endo_link").val().replace("users", "rest/v1/users"),
  			onload: function(response) {
    				var o = JSON.parse(response.responseText);
          	$("#inp_distance").val(o.distance);
 						$(".pulss").val(o.heart_rate_avg);     
            var dur = o.duration;          
 						var measuredTime = new Date(null);
    				measuredTime.setSeconds(Math.round(dur)); 
    				var MHSTime = measuredTime.toISOString().substr(11, 8);	      
          	$("#inp_ilgums").val(MHSTime);   
            $(".piezimes").val($("#endo_link").val());
            var lt = o.local_start_time;
            var dd = lt.substring(8, 10) + "/" + lt.substring(5, 7) + "/" + lt.substring(0, 4);
          	$(".nosaukums").val("Skrējiens " + dd + " " + lt.substring(11, 19));
            $("#datepicker").val(dd);
          
          	$.ajax({
  						type: 'POST',
  						url: 'http://www.noskrien.lv/wp-content/plugins/noskrien.lv/ajax_noskrietais.php?dir=saglabat&id='+unsafeWindow.last_id+'&user_id='+unsafeWindow.user_id,
  						data: $("#labot_forma").serialize(), 
  						success: function(response) { alert(response); }
						});
          
  			}
			});

});