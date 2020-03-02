(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('splashscreenCtrl', splashscreenCtrl);

    splashscreenCtrl.$inject = [
        '$scope',
        '$state',
        'mqttService',
        'brokerDetails',
        'messageService'
        ];
    
    function splashscreenCtrl(
        $scope,
        $state,
        mqttService,
        brokerDetails,
        messageService
    ) {
        var vm = this;

        vm.update = function(){
            
            $state.go('homepage');
        }

       


        console.log(brokerDetails);



       
        mqttService.initialize(brokerDetails.HOST, brokerDetails.PORT);
        mqttService.onConnectionLost(function () {
            console.error("connection lost");
        });

        messageService.initialize();
        mqttService.onMessageArrived(messageService.onMessageArrived);
    

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
                       // channel: vm.channel,
                    });
            } else if (error) {
                console.log(error)
                alert(`Could Not Connect to ${brokerDetails.HOST}:${brokerDetails.PORT}`)
            }

        },mqttOptions)
            

        
    }
})();
