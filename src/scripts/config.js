const Config = {
    ROSBRIDGE_SERVER_IP: "192.168.1.10",
    ROSBRIDGE_SERVER_PORT: "9090",
    RECONNECTION_TIMER: 3000,
    PUB_CMD_VEL_TOPIC: "/cmd_vel",
    PUB_CMD_VEL_MESSAGE:"geometry_msgs/Twist",
    SUB_CMD_POSE_TOPIC:"/amcl_pose",
    SUB_CMD_POSE_MESSAGE:"geometry_msgs/PoseWithCovarianceStamped",
    SUB_CMD_ODOM_TOPIC:"/odom",
    SUB_CMD_ODOM_MESSAGE:"nav_msgs/Odometry",
};

export default Config;