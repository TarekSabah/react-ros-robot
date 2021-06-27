import React, { Component } from 'react';
import { Joystick } from 'react-joystick-component';
import Config from '../scripts/config';
import {Row, Col, Container, Button} from "react-bootstrap";


class Teleoperation extends Component{
    state = {ros: null};

    constructor(){
        super();
        this.init_connection();
        this.handleMove = this.handleMove.bind(this);
        this.handleStop = this.handleStop.bind(this);
    }


    init_connection(){
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection",() => {          //Triger when there is an event and event here will be connected
            console.log("connection established in Teleoperation Component!");
            console.log(this.state.ros);
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


    handleMove(event) {
        console.log("Handle Move");

        //We need to create ROS Publisher on the Topic cmd_vel
        var cmd_vel = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.PUB_CMD_VEL_TOPIC, //Name of the Topic
            messageType: Config.PUB_CMD_VEL_MESSAGE, //Message Type
        }
        );
        //We need to create Twist message to be sent to ROSBridge
        var twist = new window.ROSLIB.Message({
            linear:{
                x: event.y / 50,
                y: 0,
                z: 0,
            },
            angular:{
                x: 0,
                y: 0,
                z: -event.x / 50,
            },
        });
        //We need to Publish the message on the cmd_vel Topic
        cmd_vel.publish(twist);
    }
    handleStop(event) {
        console.log("Handle Stop");
        //We need to create ROS Publisher on the Topic cmd_vel
        var cmd_vel = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.PUB_CMD_VEL_TOPIC, //Name of the Topic
            messageType: Config.PUB_CMD_VEL_MESSAGE, //Message Type
        }
        );
        //We need to create Twist message to be sent to ROSBridge
        var twist = new window.ROSLIB.Message({
            linear:{
                x: 0,
                y: 0,
                z: 0,
            },
            angular:{
                x: 0,
                y: 0,
                z: 0,
            },
        });
        //We need to Publish the message on the cmd_vel Topic
        cmd_vel.publish(twist);
    }

    render(){
        return(
        <div>
            <Row>
                <Col> 
                    <h2 className="mt-4"></h2>
                </Col>
            </Row>
            <Row>
                <Col> 
                <Joystick 
                    size={100} 
                    baseColor="#EEEEEE" 
                    stickColor="#000000" 
                    move={this.handleMove} 
                    stop={this.handleStop}>

                </Joystick>
                </Col>
            </Row>


        </div>
        );
    }
}
export default Teleoperation; 
