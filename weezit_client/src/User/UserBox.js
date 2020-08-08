import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { Text } from "react-native-elements";
import { IconButton, Colors, Avatar, Title } from 'react-native-paper';
import { storageKeys, read } from '../Storage';
import EditDetails from './EditDetails';


export default class UserBox extends Component{
    state = {
        username: read(storageKeys.Username),
        img: '../../assets/user.png'
    }

    /*async componentDidMount() { //check!
        console.log('componentDidMount function:');
        const img = await Promise.resolve(read(storageKeys.ImageUri));
        const username = await Promise.resolve(read(storageKeys.Username));
        this.setState({
            img: img,
            username: username
        })
    }*/

    render(){
        return(
        <Container style={styles.container}>
            <View style={styles.user}>
                <Title>{ this.state.username }</Title>
                <Avatar.Image size={24} source={{ uri: this.state.img}} />
            </View>

            <View style={{flex: 1}}>
                <IconButton
                    icon="account-edit"
                    color='#4DB6AC'
                    size={20}
                    onPress={() => EditDetails()}
                    style={styles.btn}
                />
            </View>
        </Container>)
    }
}
styles = StyleSheet.create({
    container: {
        flex: 1
    },
    user: {
        flex: 1
    },
    btn: {
        flex: 1
    }
})