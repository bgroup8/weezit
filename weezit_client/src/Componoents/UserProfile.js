import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Headline } from 'react-native-paper';//Avatar,
import { getData } from '../functions/checkUser';
import { Avatar,  Badge, Icon, withBadge } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const BadgedIcon = withBadge(Icon);

export const ReadUserData = async (api) => {
    try{
        const id = await getData();
        const path = 'http://proj.ruppin.ac.il/bgroup8/prod/serverSide/api/User/' + api + id;
        const response = await fetch(path, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        })
        console.log('response=', response);
        const res = await Promise.resolve(response.json());
        return res[0];
    }
    catch(err){
        console.log('ERROR: can not read user data=', err);
        return null;
    }
}

export const ChangeProfile = async (user) => { // ---
    console.log('UpdateProfile function:');
    const path = 'http://proj.ruppin.ac.il/bgroup8/prod/serverSide/api/User/UpdateProfile';
    try{
        let response = await fetch(path, {
            method: 'PUT',
            body: JSON.stringify(user),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        });
        return response.status;
    }
    catch(err){
        console.log('err=', err)
    }
}

export const User = (props) => {
    const {user} = props;
    return(
        <View style={styles.container}>
            <Headline style={styles.head}>weezit</Headline>
            <View style={styles.user}>
            <Button
                type="clear"
                icon={
                    <MaterialCommunityIcons name="account-edit" size={24} color="black" />
                }
                title={user.UserName}
                onPress={props.onPress}
            />
            <Avatar
            size="large"
            overlayContainerStyle={{backgroundColor: 'blue'}}
            rounded
            source={{
                uri:
                user.Image,
            }}
            />
            </View>           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column', 
        padding: 15,
        //flexWrap: 'wrap',
        //backgroundColor:'red'
    },
    head: {
        color: '#393f4d', 
        fontSize: 40, 
        //top: 10,
        //paddingTop: 15
    },
    img: {
        alignItems: 'center',
        marginTop: 20,
    },
    user: {
        //marginHorizontal: 15,
        //justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',    
        alignSelf: 'flex-end',   
    },
})

/*const [id, setId] = useState('')
    const [image, setImage] = useState('data:image/png;base64,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')
    const [username, setUsername] = useState('')*/
/*export function SetUser(props){
    console.log('props=', props);
    const [user, setUser] = useState({})
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            //skip
            isFirstRun.current = false;
            return;
        }
        const path = 'http://proj.ruppin.ac.il/bgroup8/prod/serverSide/api/User/Profile/' + id;
            fetch(path, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8'
                })
            }).then(res => {
                console.log('res=', res)
                if (res.ok) {
                return res.json();
                } else {
                throw res;
                }
            })
            .then( data => {
                console.log('data=', data)
                setUser(
                    data[0]
                )
                console.log('user with hook=', user)
                /*id: id,
                    username: data[0].UserName,
                    token: data[0].Token,
                    image: data[0].Image *
            //})
    //}, [user])

    if(user){
        return <Text>Loading...</Text>;
    } else {
        return(
        
            <View style={styles.user}>
                <Headline style={styles.head}>{ user.username }</Headline>
                    <Avatar.Image size={170} 
                                  source={{uri: user.image}} 
                                  style={styles.img}
                    />
            </View>
        )
    }
    
}*/