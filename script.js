var festDate = new Date(2018,6,16); //Needs update
var places = [
    { key: '', label: '' },
    { key: 'Nagyszínpad', label: 'Nagyszínpad' },
    { key: 'PajtaSzínház', label: 'PajtaSzínház' },
    { key: 'test3', label: 'test3' }
  ];

var partners = [
    { key: '', label: '' },
    { key: 'kiskacsa', label: 'kacsa' },
    { key: 'nagykacsa', label: 'nagyk' }
  ];

$(document).ready(function(){
  scheduler.config.multi_day = true;
  scheduler.config.prevent_cache = true;
  scheduler.config.xml_date = "%Y-%m-%d %H:%i";
  scheduler.config.separate_short_events = true;
  scheduler.config.start_on_monday = true;
  scheduler.locale.labels.section_type = "Helyszín";
  scheduler.config.event_duration = 60; //specify event duration in minutes for auto end time
  scheduler.config.auto_end_date = true;
  scheduler.config.details_on_dblclick = true;
  scheduler.config.details_on_create = true;
  scheduler.config.drag_create = false;
  scheduler.config.drag_resize= false;

  scheduler.form_blocks["my_editor"] = {
    render:function(sns) {
      return "<div class='dhx_cal_ltext' style='height:60px;'>Text&nbsp;<input type='text'><br/>Részletek&nbsp;<input type='text'></div>";
    },
    set_value:function(node, value, ev) {
      node.childNodes[1].value = value || "";
      node.childNodes[4].value = ev.details || "";
    },
    get_value:function(node, ev) {
      ev.details = node.childNodes[4].value;
      return node.childNodes[1].value;
    },
    focus:function(node) {
      var a = node.childNodes[1];
      a.select();
      a.focus();
    }
  };

  scheduler.templates.event_class=function(start, end, event){
    var css = "";

    if(event.place) // if event has subject property then special class should be assigned
      css += "labeled place_"+event.place;

    if(event.id == scheduler.getState().select_id){
      css += " selected";
    }
    return css; // default return
  };

  scheduler.templates.event_text = function(start,end,ev){
    return /*"<strong>" + */ev.text/* + "</strong><br>"  + ev.description*/;
  };

  scheduler.attachEvent("onBeforeEventCreated", function (e){
    return false;
  });

  scheduler.attachEvent("onEventAdded", function(id,ev){
    console.table([ev.id, ev.text, ev.stext, ev.description, ev.place, ev.partner, ev.start_date.getTime()/1000, ev.end_date.getTime()/1000]);
  });

  scheduler.attachEvent("onEventChanged", function(id,ev){
    console.table([ev.id, ev.text, ev.stext, ev.description, ev.place, ev.partner, ev.start_date.getTime()/1000, ev.end_date.getTime()/1000]);
  });

  scheduler.config.lightbox.sections = [
    { name:"Név", height:25, map_to:"text", type:"textarea" , focus:true },
    { name:"Rövidített név", height:25, map_to:"stext", type:"textarea"},
    { name:"Leírás", height:200, map_to:"description", type:"textarea"},
    { name:"Helyszín", height:21, map_to:"place", type:"select", options:places },
    { name:"Partner", height:21, map_to:"partner", type:"select", options:partners },
    { name:"time", height:72, type:"time", map_to:"auto" }
  ];

  scheduler.init('scheduler_here', festDate, "week");

  function fillScheduler(){
    var events = JSON.parse(this.responseText);
    events = events.program;
    var arrayS = [];
    for (var i = 0; i < events.length; i++){
      console.log(events[i]);
      var temp = {};
      temp.id = events[i].id;
      temp.text = events[i].name;
      temp.description = events[i].description;
      temp.place = events[i].location;
      temp.start_date = new Date(events[i].start);
      temp.start_date = temp.start_date.getFullYear() + '-' + ( +temp.start_date.getMonth() +1 ) + '-' + temp.start_date.getDate() + ' ' + temp.start_date.getHours() + ':' + temp.start_date.getMinutes();
      temp.end_date = new Date(events[i].end);
      temp.end_date = temp.end_date.getFullYear() + '-' + ( +temp.end_date.getMonth() +1 ) + '-' + temp.end_date.getDate() + ' ' + temp.end_date.getHours() + ':' + temp.end_date.getMinutes();

      arrayS.push(temp);
    }
    scheduler.parse(arrayS, "json");
  }

  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", fillScheduler);
  xhr.open("GET","https://www.gombaszog.sk/api/program");
  xhr.send();


  $('#add_event_btn').click(function(){
    scheduler.addEventNow({
      start_date: festDate
    })
  })


  $('.dhx_cal_tab').click(function(){
    if( $('[aria-label="Hét"]').attr('aria-pressed') == 'true' ){
      $('.dhx_cal_next_button').hide();
      $('.dhx_cal_prev_button').hide();
      $('.dhx_cal_today_button').hide();
      
    }
    else{
      $('.dhx_cal_next_button').show();
      $('.dhx_cal_prev_button').show();
      $('.dhx_cal_today_button').show();
    }
  });
});