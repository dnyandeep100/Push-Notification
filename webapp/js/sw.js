self.addEventListener('push', function(e){
    debugger;
    const options = {
        requireInteraction : true,
        actions : [
            {action:'view',title:'View'},{
                action : 'close',title:'Close'
            }
        ],
        data:{
            url : 'https://6fe70091trial.launchpad.cfapps.us10.hana.ondemand.com/site?siteId=ae959622-eaa0-4c52-83b3-af6472badb4e#Shell-home',
        },
        icon : 'https://www.mindsetconsulting.com/wp-content/uploads/2021/10/mindset-logo.svg',
        body : 'This is custom Notification'
    };
    e.waitUntil(
        self.registration.showNotification(e.data.text(),options)
    );
});

self.addEventListener('notificationclick',(e)=>{
    let payload = e.notification.data;
    if(e.action === 'view'){
    clients.openWindow(payload?.["url"]);
    }
});