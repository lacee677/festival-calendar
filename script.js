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

  scheduler.attachEvent("onBeforeEventCreated", function (e){
    return false;
  });

  scheduler.attachEvent("onEventAdded", function(id,ev){
    console.table([ev.text, ev.stext, ev.description, ev.place, ev.partner, ev.start_date.getTime()/1000, ev.end_date.getTime()/1000]);
  });

  scheduler.attachEvent("onEventChanged", function(id,ev){
    console.table([ev.text, ev.stext, ev.description, ev.place, ev.partner, ev.start_date.getTime()/1000, ev.end_date.getTime()/1000]);
  });

  var places = [
    { key: '', label: 'default' },
    { key: 'nagyszinpad', label: 'Nagyszínpad' },
    { key: 'test2', label: 'test2' },
    { key: 'test3', label: 'test3' }
  ];

  var partners = [
    { key: '', label: 'default',
      key: 'kiskacsa', label: 'kacsa'}
  ];

    scheduler.config.lightbox.sections = [
    { name:"Név", height:25, map_to:"text", type:"textarea" , focus:true },
    { name:"Rövidített név", height:25, map_to:"stext", type:"textarea"},
    { name:"Leírás", height:200, map_to:"description", type:"textarea"},
    { name:"Helyszín", height:21, map_to:"place", type:"select", options:places },
    { name:"Partner", height:21, map_to:"partner", type:"select", options:partners },
    { name:"time", height:72, type:"time", map_to:"auto" }
  ];

  scheduler.init('scheduler_here', new Date(2018,6,16), "week");

  scheduler.parse([
    {id:"1", start_date:"2018-07-18 01:00", end_date:"2018-07-18 12:00", text:"Koncert", stext:"konc", description:"hosszabb text vagy mi", place:"nagyszinpad", partner:"kiskacsa"},
    {id:"2", start_date:"2018-07-18 02:00", end_date:"2018-07-18 14:00", text:"Koncert2", stext:"konc2", description:"hosszabb text vagy mi", place:"test2", partner:"kiskacsa"},
    {id:"3", start_date:"2018-07-19 02:00", end_date:"2018-07-19 03:00", text:"Koncert3", stext:"konc3", description:"hosszabb text vagy mi", place:"test3", partner:"kiskacsa"}
  ],"json")

  $('#add_event_btn').click(function(){
    scheduler.addEventNow({
      start_date: new Date(2018,6,16,0,0)
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