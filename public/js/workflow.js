(function () {
  var workflow =
    {
      "title": "Zoom Demo",
      "topics": [
	{
	  "title": "Overview",
	  "ttl": "20",
	  "links": [
	    "https://marketplace.zoom.us/develop/create?source=devdocs"
	  ]

	},
	{
	  "title": "Checklist Overview",
	  "ttl": "20",
	  "links": [
	  ]

	},
	{
	  "title": "Links",
	  "ttl": "10",
	  "links": [
	    "https://marketplace.zoom.us/develop/create?source=devdocs",
	  ]

	},
	{
	  "title": "QnA",
	  "ttl": "30",
	  "links": [
	    "https://marketplace.zoom.us/develop/create?source=devdocs",
	  ]

	}
      ]
    };

  const overlayAddAgendaButton = '<div id="overlay"><button id="overlay-add-agenda">Add Agenda</button></div>';
  const checkListContainer = '<div id="overlay-checklist"></div>';
  const timeCheckContainer = '<div id="overlay-timecheck"><h2>this is a timecheck</h2><img src="/images/timecheck.png"></div>';

  var workflowContainers = overlayAddAgendaButton +  checkListContainer + timeCheckContainer;

  $( "body" ).append( workflowContainers );



  $("#overlay-add-agenda").click(function() {

    $("#overlay-add-agenda").hide();

    var checklistHTML = '<h2>' + workflow.title + ' </h2>';

    for(var i =0;i <workflow.topics.length; i++) {
      var topic = workflow.topics[i];
      var topicID = "topic-" + i;
      checklistHTML+= '<div class="checklist-item"> <input type="checkbox"  id="' + topicID + '"> ' + topic.title + ' (' + topic.ttl + ') </div>';
    }

    $("#overlay-checklist").html(checklistHTML);

    var currentTopicID = 0;
    var startTime = new Date().getTime();
    $("#topic-" + currentTopicID).parent().addClass("checklist-highlight");

    console.log(workflow.topics[currentTopicID].title);

    setInterval(function(){
      var timeElapsed = new Date().getTime() - startTime;
      var topicTime = workflow.topics[currentTopicID].ttl * 1000;
      if(timeElapsed > topicTime) {

	$("#topic-" + currentTopicID).prop("checked", true);
	$("#topic-" + currentTopicID).parent().removeClass("checklist-highlight");

	startTime = new Date().getTime();
	currentTopicID += 1;
	$("#topic-" + currentTopicID).parent().addClass("checklist-highlight");
	console.log(workflow.topics[currentTopicID].title)
      }

      if (timeElapsed > topicTime/2 ) {
	$("#overlay-timecheck").show();
      } else {
	$("#overlay-timecheck").hide();
      }
    }, 1000);

  });


})();
