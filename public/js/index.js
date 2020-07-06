(function () {

    console.log('checkSystemRequirements');
    console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

    // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
    // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.8/lib', '/av'); // CDN version default
    // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.7.8/lib', '/av'); // china cdn option
    // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();

    var API_KEY = 'rYw9P79tQe2Rx693q_6zOQ';

    /**
     * NEVER PUT YOUR ACTUAL API SECRET IN CLIENT SIDE CODE, THIS IS JUST FOR QUICK PROTOTYPING
     * The below generateSignature should be done server side as not to expose your api secret in public
     * You can find an eaxmple in here: https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
     */

    testTool = window.testTool;
    document.getElementById('display_name').value = "CDN" + ZoomMtg.getJSSDKVersion()[0] + testTool.detectOS() + "#" + testTool.getBrowserInfo();
    document.getElementById('meeting_number').value = testTool.getCookie("meeting_number");
    document.getElementById('meeting_pwd').value = testTool.getCookie("meeting_pwd");
    if (testTool.getCookie("meeting_lang")) document.getElementById('meeting_lang').value = testTool.getCookie("meeting_lang");

    document.getElementById('meeting_lang').addEventListener('change', function (e) {
        testTool.setCookie("meeting_lang", document.getElementById('meeting_lang').value);
        $.i18n.reload(document.getElementById('meeting_lang').value);
        ZoomMtg.reRender({lang: document.getElementById('meeting_lang').value});
    });

    document.getElementById('clear_all').addEventListener('click', function (e) {
        testTool.deleteAllCookies();
        document.getElementById('display_name').value = '';
        document.getElementById('meeting_number').value = '';
        document.getElementById('meeting_pwd').value = '';
        document.getElementById('meeting_lang').value = 'en-US';
        document.getElementById('meeting_role').value = 0;
    });

    document.getElementById('join_meeting').addEventListener('click', function (e) {

        e.preventDefault();

        if (!this.form.checkValidity()) {
            alert("Enter Name and Meeting Number");
            return false;
        }

        var meetConfig = {
            apiKey: API_KEY,
            meetingNumber: parseInt(document.getElementById('meeting_number').value),
            userName: document.getElementById('display_name').value,
            passWord: document.getElementById('meeting_pwd').value,
            leaveUrl: "https://zoom.us",
            role: parseInt(document.getElementById('meeting_role').value, 10)
        };
        testTool.setCookie("meeting_number", meetConfig.meetingNumber);
        testTool.setCookie("meeting_pwd", meetConfig.passWord);

        axios.post('/signature', {
            meetingNumber: meetConfig.meetingNumber,
            role: meetConfig.role
        })
            .then(function (response) {
                console.log(response);
                ZoomMtg.init({
                    leaveUrl: window.location.origin,
                    success: function () {
                        ZoomMtg.join(
                            {
                                meetingNumber: meetConfig.meetingNumber,
                                userName: meetConfig.userName,
                                signature: response.data.signature,
                                apiKey: meetConfig.apiKey,
                                passWord: meetConfig.passWord,
                                success: function (res) {
                                    $('#nav-tool').hide();
                                    console.log('join meeting success');
                                },
                                error: function (res) {
                                    console.log(res);
                                }
                            }
                        );
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
            });

    });

    document.getElementById('start_new_meeting').addEventListener('click', function (e) {
        e.preventDefault();

        axios.post('/meetings').then(function (response) {
            console.log(response);


            Toastify({
                text: "Meeting created",
                duration: 3000
            }).showToast();


            var meetConfig = {
                apiKey: API_KEY,
                meetingNumber: response.data.id,
                userName: 'Hello',
                passWord: response.data.password,
                leaveUrl: "https://zoom.us",
                role: 1
            };
            console.log(meetConfig);
            axios.post('/signature', {
                meetingNumber: meetConfig.meetingNumber,
                role: meetConfig.role
            }).then(function (response) {
                    console.log(response);
                    ZoomMtg.init({
                        leaveUrl: window.location.origin,
                        success: function () {
                            ZoomMtg.join(
                                {
                                    meetingNumber: meetConfig.meetingNumber,
                                    userName: meetConfig.userName,
                                    signature: response.data.signature,
                                    apiKey: meetConfig.apiKey,
                                    passWord: meetConfig.passWord,
                                    success: function (res) {
                                        $('#nav-tool').hide();
                                        console.log('join meeting success');
                                    },
                                    error: function (res) {
                                        console.log(res);
                                    }
                                }
                            );
                        },
                        error: function (res) {
                            console.log(res);
                        }
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }).catch(function (error) {
            if(error.response.status == 401) {
                window.location = '/login'
            }
        });


    })

})();
