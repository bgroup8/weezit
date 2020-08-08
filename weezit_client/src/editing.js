import React, { useState } from 'react';
import { Button, Overlay, Input  } from 'react-native-elements';

function Edit(){
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View>
      <Button title="Open Overlay" onPress={toggleOverlay} />

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text>Hello from Overlay!</Text>
      </Overlay>
    </View>
  );
};
export default Edit;

