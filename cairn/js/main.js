roll = (d) => {return Math.ceil(Math.random()*d)}

$('#character').html(generate_text('character'));
$('#age').html(roll(20)+roll(20)+10);
$('#hp').html(roll(6));
['str','dex','wil'].forEach((item, i) => {
  $('#'+item).html(roll(6)+roll(6)+roll(6))
});

$('#armour').html(generate_text('armour'));
$('#helmet').html(generate_text('helmet'));
$('#weapons').html(generate_text('weapons'));
$('#bonus').html(generate_text('bonus'));
$('#gold').html(roll(6)+roll(6)+roll(6));
