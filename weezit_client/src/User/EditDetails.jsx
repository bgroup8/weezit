import React, {useState, useEffect} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, TextInput, Colors } from 'react-native-paper';
import { read, save, storageKeys } from '../Storage';
//import { Container } from 'native-base';
import { openGalery } from '../OpenGallery';
import { Tile, Button  } from 'react-native-elements';
import imageUri from '../../assets/user.png';

const EditDetails = () => {
  console.log('imageUri=', imageUri);
    const [usernameVal, setUsername] = useState(read(storageKeys.Username));
    const [imageVal, onChangeImage] = useState('../../assets/user.png');

    onChangeImage = async () => {
      console.log('onChangeImage function');
        let obj = await openGalery();
        console.log('obj=',obj);
        return obj.picUri;
    }

    const [saveVal, setSaveState] = useState(false);
    useEffect(function updateDetails() {
      console.log('updateDetails function');
        if(saveVal){
            save(storageKeys.Username, usernameVal);
            save(storageKeys.ImageUri, imageVal);
        }
    });
    
    return(
        <Surface style={styles.container}>

            <Surface style={styles.textInputContainer}>
            <TextInput
                label='Username'
                value={usernameVal}
                onChangeText={(value) => setUsername(value)}
                placeholderTextColor={Colors.teal300}
                style={styles.textInput}
            />
            </Surface>
            
            <Surface style={styles.imgContainer}>
                <TouchableOpacity onPress={onChangeImage()}>
                <Tile imageSrc={{ uri: imageVal }}
                      icon={{ name: 'photo-library', type: 'MaterialIcons' }}
                      imageContainerStyle={styles.img}
                />
                </TouchableOpacity>
            </Surface>

            <Surface style={styles.btnContainer}>
                <Button title="SAVE"
                        type="outline"
                        buttonStyle={styles.btn}
                        onPress={() => setSaveState(true)}/>
            </Surface>
        </Surface>
        
    )

}
export default EditDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    height: 20,
    flex: 1,
    minHeight: '7%',
    marginTop: '5%',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderColor: 'rgb(222,222,222)',
    borderBottomWidth: 1,
    paddingRight: 10,
    paddingBottom: 5
  },
  imgContainer: {

  },
  img: {
    resizeMode: 'cover',
    height: 100,
    width: 200
  },
  btnContainer: {

  },
  btn: {

  }
})