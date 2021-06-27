import React, { Component } from 'react';
import {Row, Col, Container, Button} from "react-bootstrap";
import Config from '../scripts/config';
import * as Three from "three";


class RobotState extends Component{
    state = {
        ros: null,
        x:0,
        y:0,
        Orientation:0,
        Linear_velocity:0,
        Angular_velocity:0,
    };

    constructor(){
        super();
        this.init_connection();
    }


    init_connection(){
        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection",() => {          //Triger when there is an event and event here will be connected
            console.log("connection established in RobotState Component!");
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

    componentDidMount(){
        this.getRobotState();
        // this.getOrientationFromQuaternion();
    }

    getRobotState() {
        //Create Pose Subscriber
        var pose_subscriber = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.SUB_CMD_POSE_TOPIC,
            messageType: Config.SUB_CMD_POSE_MESSAGE,
        });
        //Create a pose callback
        pose_subscriber.subscribe((message) => {
            this.setState({x: message.pose.pose.position.x.toFixed(2)});
            this.setState({y: message.pose.pose.position.y.toFixed(2)});
            this.setState({
                Orientation: this.getOrientationFromQuaternion(
                    message.pose.pose.orientation
                    ).toFixed(2),
                });
        }); 

        //Create a subscriber for the velocities in the odom topic

        var velocity_subscriber = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.SUB_CMD_ODOM_TOPIC,
            messageType: Config.SUB_CMD_ODOM_MESSAGE,
        });
        //Create a pose callback
        velocity_subscriber.subscribe((message) => {
            this.setState({Linear_velocity: message.twist.twist.linear.x.toFixed(2)});
            this.setState({Angular_velocity: message.twist.twist.angular.z.toFixed(2)});
        }); 
        
    } 

    getOrientationFromQuaternion(ros_orientation_quaternion){
        var q = new Three.Quaternion(
            ros_orientation_quaternion.x,
            ros_orientation_quaternion.y,
            ros_orientation_quaternion.z,
            ros_orientation_quaternion.w
            ); 

        //Convert this quaternion into Roll, Pitch and Yaw
        var RPY = new Three.Euler().setFromQuaternion(q);
        return RPY["_z"] * (180 / Math.PI);
    }

    //Create a subscriber for the 


    render(){
        return(
            <div>
                <Row>
                    <Col>
                    <h4 className="mt-5">Position</h4>
                    <p className="mt-0">x: {this.state.x}</p>
                    <p className="mt-0">y: {this.state.y}</p>
                    <p className="mt-0">Orientation: {this.state.Orientation}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <h4 className="mt-4">Velocities</h4>
                    <p className="mt-0">Linear Velocity: {this.state.Linear_velocity}</p>
                    <p className="mt-0">Angular Velocity: {this.state.Angular_velocity}</p>

                    </Col>
                </Row>
            </div>
        );
    }
}
export default RobotState; 