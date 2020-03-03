angular.module('app').service('messageService', messageService);

messageService.$inject = [
    'mqttService',
    'brokerDetails',
    '$timeout'
];


function messageService(mqttService, brokerDetails, $timeout) {
    var vm = this;
    vm.initialize = initialize;
    vm.onMessageArrived = onMessageArrived;
    vm.subscribe = subscribe;
    vm.unsubscribe = unsubscribe;
    var topicPath;
    var subscriberName;
    var registry = {};
    vm.registry = registry;
    registry[topicPath] = {};
    registry[subscriberName] = {};
    

    function initialize(){
        console.log("Message service ini");
        
    }

    


    

    function onMessageArrived(message){
        console.log(registry[message.topic]);
        var subscribers = registry[message.topic]; //null check
        if(subscribers != null){
            subscribers.forEach(function(subscriber){ //null check
                $timeout(
                    function(){
                        subscriber(message);
                    });
            });
        }
        //console.log(JSON.stringify(message.topic));
        //console.log(message);
    }

    function subscribe(subscriberName, topicPath, callback){
        registry[topicPath][subscriberName] = callback;
    }

    function unsubscribe(subscriberName,topicPath){
        delete registry[topicPath][subscriberName];
    }

    


}