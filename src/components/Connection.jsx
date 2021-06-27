import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Config from '../scripts/config';

class Connection extends Component{
    state  = {connected : false, ros: null }; //ros only handle the object for the connection, so we can use it inside the Connection.jsx

    // We need to make constructor to be able to call this.state.ros method
    constructor(){
        super();
        this.init_connection();
    }


    init_connection(){
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection",() => {          //Triger when there is an event and event here will be connected
            console.log("connection established!");
            this.setState({connected : true});           //Update the state if connected
        });
        
        this.state.ros.on("close", () => {          //Create another event when the connection is closed
            console.log("connection is closed");
            this.setState({connected : false});
            setTimeout(() => {
                try {
                    this.state.ros.connect(
                        "ws://" +
                        Config.ROSBRIDGE_SERVER_IP +
                        ":" +
                        Config.ROSBRIDGE_SERVER_PORT);                     //This event will take a string that represent the connections, setting the IP
                                                                // address and the PORT number 
                }catch(error){
                    console.log("connection problem");
                }
            },Config.RECONNECTION_TIMER);
        });
        //To take the connection parameters
        //We need to get them from the machine where the ROSbridge is running
        //To get the IP write command ifconfig
        //And the PORT Number by default is 9090
        try {
            this.state.ros.connect(
                "ws://" +
                Config.ROSBRIDGE_SERVER_IP +
                ":" +
                Config.ROSBRIDGE_SERVER_PORT
            );                     //This event will take a string that represent the connections, setting the IP
                                                        // address and the PORT number 
        }catch(error){
            console.log("connection problem");
        }
    }

    render() {
        return(
            <div>
                <Alert className='text-center mt-3' variant={this.state.connected? "success":"danger"}> 
                    {this.state.connected? "Robot Connected": "Robot Disconnected" }
                </Alert>
            </div>
            //<h2>Connection</h2>
         );
    } 
}

export default Connection;