(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('splashscreenCtrl', splashscreenCtrl);

    splashscreen.$inject = [
        '$scope',
        '$state',
        'mqttService',
        'brokerDetails'
        ];
    
    function splashscreenCtrl(
        $scope,
        $state,
        mqttService,
        brokerDetails
    ) {
        var vm = this;

        vm.update = function(){
            
            $state.go('homepage');
        }

        //Initialises the range of channels that can be selected and the selected channel
        vm.channels = Array.apply(null, {
            length: 5
        }).map(Function.call, Number);;
        vm.channel = 0;


        console.log(brokerDetails);

        vm.go = go;

        /*
        Validates ip address and channel, if valid state changes to the Car Control state .
        If details are not valid alert is shown.
        */
        function go(valid) {
            if (!valid) {
                alert("Invalid Details")
            } else {
                mqttService.initialize(brokerDetails.HOST, brokerDetails.PORT);
                mqttService.onConnectionLost(function () {
                    console.error("connection lost");
                });


                var mqttOptions = {};

                if (brokerDetails.SSL) { mqttOptions.useSSL = brokerDetails.SSL; }
                if (brokerDetails.USERNAME) {
                    mqttOptions.userName = brokerDetails.USERNAME;
                    if(brokerDetails.PASSWORD){
                        mqttOptions.password = brokerDetails.PASSWORD;
                    }
                }

                

                mqttService.connect(function (success, error) {
                    if (success) {
                        $state.transitionTo('homepage',
                            {
                                channel: vm.channel,
                            });
                    } else if (error) {
                        console.log(error)
                        alert(`Could Not Connect to ${brokerDetails.HOST}:${brokerDetails.PORT}`)
                    }

                },mqttOptions)
            }

        }
    }
})();
