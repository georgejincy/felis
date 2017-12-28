const CDP = require('chrome-remote-interface')
var ws = ''
CDP.List(function (err, targets) {
    if (!err) {
        console.log(targets)
        // Get the webSocketDebuggerUrl for Ringleader
        for (var i=0, j=targets.length; i<j; i++) {
        	if(targets[i].title === 'RingLeader') {
        		ws = targets[i].webSocketDebuggerUrl
        		break;
        	}
        	console.log(i)
        }

        if (ws === '') {
        	console.log("Error: Could not find chrome page")
        	process.exit(1)
        }

        const options = {
        	tab: ws
        }
        // connect to endpoint
        CDP(options, (client) => {
            console.log('Connected!')
            // extract domains
             const {Runtime} = client
            try{
            	Runtime.evaluate({
            	        returnByValue: true,
            	        expression: `foobar.foo()`
            	    },(err, result) => {
            	        response = result
            	        console.log('response: ' + JSON.stringify(response))
            	        console.log('runtime err: ' + err)
            	        console.log("Closing client")
            	        client.close()
            	    })
            }
            catch (err) {
            	console.log('trycatch err: ' + err)
            }
           
 
        }).on('error', (err) => {
            console.error(err);
        })

    } else {
    	console.log(err)
    	process.exit(1)
    }
})



