(function () {
    var workflow =
        {
            "title": "Zoom Demo",
            "topics": [
                {
                    "title": "Overview",
                    "ttl": "30",
                    "links": [
                        "https://marketplace.zoom.us/develop/create?source=devdocs"
                    ]

                },
                {
                    "title": "Checklist Overview",
                    "ttl": "30",
                    "links": [
                    ]

                },
                {
                    "title": "Links",
                    "ttl": "30",
                    "links": [
                        "https://marketplace.zoom.us/develop/create?source=devdocs",
                    ]

                },
                {
                    "title": "QnA",
                    "ttl": "3000",
                    "links": [
                        "https://marketplace.zoom.us/develop/create?source=devdocs",
                    ]

                }
            ]
        };


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

        console.log(workflow.topics[currentTopicID].title);


        setInterval(function(){
            var timeElapsed = new Date().getTime() - startTime;
            if(timeElapsed > (workflow.topics[currentTopicID].ttl * 1000)) {

                $("#topic-" + currentTopicID).prop("checked", true);

                startTime = new Date().getTime();
                currentTopicID += 1;
                console.log(workflow.topics[currentTopicID].title)
            }
        }, 1000);

    });


})();
