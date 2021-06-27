import React, { Component } from 'react';
import Connection from './Connection';
import Teleoperation from './Teleoperation';
import RobotState from './RobotState';
import Map from './Map';
import {Row, Col, Container, Button} from "react-bootstrap";

class Home extends Component{
    state = {};
    render(){
        return(
            <div>
                <Container>
                    <h1 className="text-center mt-3">Robot Control Page</h1>
                    <Row>
                        <Col> 
                            <Connection />
                        </Col>
                    </Row>
                    <Row>
                        <Col> 
                            <h2>Teleoperation </h2>
                        </Col>
                        <Col> 
                            <h2>Map</h2>
                            
                        </Col>
                    </Row>

                    <Row>
                        <Col> 
                            <Teleoperation />
                            <RobotState /> 
                        </Col>
                        <Col> 
                            <Map></Map>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export default Home;