import React, { useState } from 'react';
import { View, StyleSheet, AsyncStorage, Text } from 'react-native';
import { Avatar, Headline } from 'react-native-paper';
import { getData } from '../functions/checkUser';

const getRequest = {
    method: 'GET',
    headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
    })
}

export class Account extends React.Component {
    constructor(props){
        super(props);
        console.log('Account props=', props);
        //isUpdate: this.props.isUpdate
        this.action = this.props.action;
        this.id = this.props.id;
        this.state = { 
            user: null, isReady: false,
            isGet: false, username: '', image: '', id: null, counter: 0 
        }
    }

    componentDidMount(){
        this.readUser()
    }
 
    readUser = () => {
        const { id } = this;
        try{
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
                //image = image;
                //console.log('image=', image);
                this.setState({user: data[0], isReady: true}, () => console.log('this user=', this.state.user))
            })//Image
        }
        catch(err){
            console.log('err=', err);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.user){
            return true;
        }
        if ('refresh' === nextProps.action){
            console.log('nextProps=', nextProps);
            console.log('this.props=', this.props);
            return true;
        }
        return false;
    }

    render(){
        const { image, username, isReady, user } = this.state;
        if(!isReady){
            return <Text>Loading...</Text>;
        }
        return(
            <View style={styles.user}>
                <Headline style={styles.head}>{ user.UserName }</Headline>
                    <Avatar.Image size={170} 
                                  source={{uri: user.Image}} 
                                  style={styles.img}
                    />
            </View>
        )
    }
}
export default Account;
//Account.defaultProps = { isUpdate: false };
const styles = StyleSheet.create({
    head: {
        color: '#393f4d', 
        fontSize: 40, 
        top: 15,
        paddingTop: 15
    },
    img: {
        alignItems: 'center',
        marginTop: 20,
    },
    user: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',       
    },
})