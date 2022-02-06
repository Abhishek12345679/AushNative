import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';

const CameraScreen = () => {
    const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();

    useEffect(() => {
        Camera.getCameraPermissionStatus().then(setCameraPermission);
    }, []);

    if (cameraPermission == null) {
        // still loading
        Camera.getCameraPermissionStatus().then(setCameraPermission);

    }

    return (
        <View>
            <Text></Text>
        </View>
    );
};

export default CameraScreen;
