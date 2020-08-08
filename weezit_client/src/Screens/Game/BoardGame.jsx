import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated, Text, ImageBackground, SafeAreaView, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import {firebase, db} from './Firebase';
import Constants from 'expo-constants';
import { Caption, Colors, IconButton } from 'react-native-paper';//import {  } from 'react-native-paper';
import { Avatar, Icon, Badge, Overlay } from 'react-native-elements';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { userState, deleteGame, getRandomInt, correctEmoji, mistakeEmoji, ifWon, gameState } from '../../functions/player';
import Emoji from 'react-native-emoji';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Animatable from 'react-native-animatable';
import { AlertHelper } from '../../Componoents/Popup';
import Dialog from 'react-native-dialog';
const { width, height } = Dimensions.get('screen');


let ref = db.ref('/games');
//const api = 'http://proj.ruppin.ac.il/bgroup8/prod/serverSide/api/User/UpdateGameResult/';

class BoardGame extends React.Component {
    static navigationOptions = {
        headerShown: false,
      };
    //
    constructor(props) {
        super(props)
        console.log('*** BoardGame Component ***');
        console.log('BoardGame props=', props);
        this.id = props.navigation.state.params.id;
        this.key = props.navigation.state.params.key;
        this.gameRef;
        this.otherPlayerRef;
        this.roundRef;
        this.isCreator = props.navigation.state.params.isCreator;
        //console.log('this.key=', this.key);
        this.state = {
            isReady: false,//update
            creator: null,
            joiner: null,
            index: 0, //update
            //overlay_bg: '../../Background/abstract-yellow-comic-zoom/923.jpg',
            //isOverlay: false,
            //countdown: 15, // seconds countdown for answering the question
            //show_result: false, // whether to show whether the user's answer is correct or incorrect
            //selected_option: null, // the last option (A, B, C, D) selected by the user
            //disabled: false, // whether to disable the options from being interacted on or not
            display: 'none',
            bg: Colors.purple500,//update
            question: '',//update
            emojiName: '',//update
            counterKey: null,
            data: ['A', 'B', 'C'],//questionList[index]
            isCreator: false,//update
            options: [],//update
            isWon: false,//update?
            isPlaying: false,//update?
            visibleDialog: true,
            c_status: 'primary',//update
            c_img: '',//update
            c_username: '',//update
            c_correct: 0,//update            
            //c_bg: Colors.purple500,//avatar bg

            j_status: 'primary',//update
            j_img: '',//update
            j_username: '',//update
            j_correct: 0,//update
            //j_bg: Colors.purple500,//avatar bg

            showAlert: false,
            //txtResult: ''
        }

    }

    //canging on 27/7 --- may

    componentDidMount(){
        console.log('componentDidMount:');
        const { key, id, isCreator } = this;
        const { index } = this.state;
        let d = {};
        let c = {};
        let j = {};
        
        let c_img;
        let c_username;

        let j_img;
        let j_username;       
        //let isCreator = false;

        const gameRef = ref.child(key);
        if(index === 0){//read this data only in the first time           
            gameRef.once('value')
            .then((snap) => {
                snap.forEach((data) => {
                    console.log('data.val()=', data.val())
                    switch(data.key){
                        case 'questionsList':
                            d = data.val();
                            break;
                        case 'creator':
                            c = data.val();
                            c_img = data.val().image;
                            c_username = data.val().username;                    
                            break;
                        case 'joiner':
                            j = data.val();
                            j_img = data.val().image;
                            console.log('data.val().image=', data.val().image)
                            j_username = data.val().username;
                            console.log('data.val().username=', data.val().username)
                            break;
                    }                   
                })
            }).then(() => {
                console.log('d[index]=',d[index].options)
                this.setState({ 
                    creator: c,
                    c_img: c_img, 
                    c_username: c_username,
                    joiner: j, 
                    j_img: j_img,  
                    j_username: j_username,
                    data: d,
                    options: d[index].options,
                    //isReady: true,
                    question: d[index].question,
                    //isPlaying: true,     
                },() => this.waitingStation())
            }).catch((err) => {
                console.log('can not read realtime - can not start play=', err)
            })
        } 
    }

    waitingStation = () => {
        this.gameRef = ref.child(this.key);
        
        if(this.isCreator){
            ref.child(this.key + '/creator').update({ userState: userState.in});
            this.gameRef.child('joiner/userState')
            .once('value')
            .then((snap) => {
                if(snap.val() === userState.in){
                    ref.child(this.key).update({ state: gameState.ready});
                    //this.gameRef.update({ state: gameState.ready});
                    this.gameRef.off();
                    this.setState({ isReady: true, isPlaying: true },() => this.gameListener());
                }else {
                    this.gameRef.on('child_changed', (snap) => {
                        console.log('snap key=', snap.key)
                        if(snap.key === 'state' && snap.val() === gameState.ready){
                            this.gameRef.off();
                            this.setState({ isReady: true, isPlaying: true },() => this.gameListener());
                        }
                    })
                }
            })
        } else {
            ref.child(this.key + '/joiner').update({ userState: userState.in});
            this.gameRef.child('creator/userState')
            .once('value')
            .then((snap) => {
                if(snap.val() === userState.in){
                    ref.child(this.key).update({ state: gameState.ready});
                    //this.gameRef.update({ state: gameState.ready});
                    this.gameRef.off();
                    this.setState({ isReady: true, isPlaying: true },() => this.gameListener());
                }else {
                    this.gameRef.on('child_changed', (snap) => {
                        console.log('snap key=', snap.key)
                        if(snap.key === 'state' && snap.val() === gameState.ready){
                            this.gameRef.off();
                            this.setState({ isReady: true, isPlaying: true },() => this.gameListener());
                        }
                    })
                }
            })
        }
    }

    next = () => {
        console.log('*** next ***');
        const { index, data} = this.state;
        const i = index + 1;
        console.log('i=', i);
        if(i < data.length){
            this.gameRef.child('round').update({ creatorState: userState.await, joinerState: userState.await, num: i})
            this.setState({
                index: i,
                emojiName: '', 
                disabled: false, 
                bg: Colors.purple500,
                options: data[i].options,
                question: data[i].question,
                c_status: 'primary',
                j_status: 'primary',
                display: 'none'
            })                                  
        } else {
            console.log('*** game is overrrr ***');
            this.setState({ isPlaying: false })//work
            this.gameRef.child('round/num').remove();//work
            //or game is over or user left the game --> any way game removed BUT from different state 
        }
        
    }

    gameListener = () => {
        const { c_username, j_username, options, isCreator } = this.state;
        console.log('*** gameListener ***');
        console.log('options=', options);
        
        this.roundRef = this.gameRef.child('round');
        this.roundRef.on('child_changed', (snap) => { 
            console.log('child_changed snap=', snap.key); 
            console.log('child_changed snap=', snap.val()); 
            if(snap.key === 'num'){
                this.next();//work
            } else {
                switch(snap.val()){
                    case userState.wrong://work
                        if(snap.key === 'creatorState'){
                            this.setState({ c_status: 'error' })
                        } else {
                            this.setState({ j_status: 'error' })
                        }
                        break;
                    case userState.right://work
                        if(snap.key === 'creatorState'){
                            this.setState({ c_status: 'success', c_correct: this.state.c_correct + 1 })
                        } else {
                            this.setState({ j_status: 'success', j_correct: this.state.j_correct + 1 })
                        }
                        break;
                }
            }
        })

        this.roundRef.on('child_removed', (snap) => {//to know if game is over
            console.log('game is over snap=', snap.key);  
            console.log('game is over snap=', snap.val()); 
            this.gameRef.off();
            this.gameOver();          
             //num is the only one can removed here and that's happend whed game is over
        })

        this.gameRef.on('child_removed', (snap) => {//to know if someone leaved the game
            console.log('child_removed snap=', snap.key);    
            console.log('child_removed snap=', snap.val());  
            this.gameRef.off();        
            //only creator and joiner can remove from here and that's happened whan one of them leave before the end           
            if(this.isCreator && snap.key == 'joiner'){//joiner left
                AlertHelper.show('warn', 'warn', 'Looks like' + j_username + 'left the game sooooo....');
                this.setState({ j_correct: 0, c_correct: 1},() => this.gameOver());
            } else if(!this.isCreator && snap.key == 'creator'){
                AlertHelper.show('warn', 'warn', 'Looks like' + c_username + 'left the game sooooo....');
                this.setState({ j_correct: 1, c_correct: 0},() => this.gameOver());
            }
        })     
    }

    gameOver = () => {//work
        console.log('*** gameOver ***')
        const { j_correct, c_correct, isCreator } = this.state;
        //this.gameRef.off();//stop listening game
        let isWon = ifWon(c_correct, j_correct, this.isCreator);
        console.log('this.id=', this.id)
        
        deleteGame(this.key);
        this.props.navigation.navigate('Game_Over', {isWon: isWon, userId: this.id})
    }

    leave = () => {//work
        console.log('*** leave ***')
        this.setState({ showAlert: false });
        this.gameRef.off();

        if(this.isCreator){
            this.gameRef.child('creator').remove();
        } else {
            this.gameRef.child('joiner').remove()
        }
        this.props.navigation.navigate('Game');
    }

    exit = () => this.setState({ showAlert: true });//work

    onCancel = () => this.setState({ showAlert: false });//work

    checkAnswer = (a) => {//work
        console.log('*** checkAnswer ***');
        console.log('checkAnswer e=', a);
        const { key } = this;
        const { index, data, isCreator} = this.state;
        const { correct } = data[index];
        let i;
        let state;

        if(a == correct){//work
            i = getRandomInt(correctEmoji.length);
            this.setState({ emojiName: correctEmoji[i], disabled: true, bg: Colors.purple100, display: 'flex' })
            state = userState.right;
        } else{//work
            i = getRandomInt(mistakeEmoji.length);
            this.setState({ emojiName: mistakeEmoji[i], disabled: true, bg: Colors.purple100, display: 'flex'  })
            state = userState.wrong;
        }
        
        if(this.isCreator){//work
            ref.child(key + '/round').update({ creatorState: state})
        } else {
            ref.child(key + '/round').update({ joinerState: state})
        }
    }

    render() {
        const { isReady, index, options, display, disabled, bg, emojiName,  j_img, c_img, isPlaying, c_username, j_correct, c_correct, j_status, c_status,  overlay_bg, isOverlay, txtResult, question, showAlert} = this.state;
        
        if(!isReady){
            return(
                <ImageBackground source={require('../../Background/abstract-yellow-comic-zoom/923.jpg')} style={{width: '100%', height: '100%'}}>
                    <View style={styles.loadingContainer}>
                        <Text>Connecting Game...</Text>
                        <ActivityIndicator size='large' color='#6646ee' /> 
                    </View>
                </ImageBackground>               
            )
        } else {
            return (
                <ImageBackground source={require('../../Background/abstract-yellow-comic-zoom/923.jpg')} style={{width: '100%', height: '100%'}}>
                    <SafeAreaView style={styles.container}>
                        <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={[{ display: display }, styles.animatable]}>
                            <Emoji name={emojiName} style={{fontSize: 80}} />
                        </Animatable.Text>
                        <IconButton
                            icon="close"
                            style={{alignSelf:'flex-end'}}
                            color={Colors.red500}
                            size={35}
                            onPress={() => this.exit()}
                        />
                        <View style={styles.container1}>  
                        <Text style={styles.questionTxt}>{(index + 1) + ' / 10'}</Text>   
                        <Text style={styles.questionTxt}>{question}</Text>                      
                            {options.map((item) => {
                                return(
                                    <TouchableOpacity disabled={disabled}
                                        onPress={() => {this.checkAnswer(item)}}
                                        style={[styles.btn, {backgroundColor: bg, borderColor: bg}]}
                                    >
                                        <Text style={{ color: "white", fontSize: 20 }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}

                            <CountdownCircleTimer
                                key={index}
                                size={80}
                                strokeWidth={7}
                                isPlaying={isPlaying}
                                duration={15}
                                onComplete={() => {
                                    console.log('onComplete=')
                                    this.next();                             
                                    return [isPlaying, 1500] // repeat animation in 1.5 seconds
                                }}
                                colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000']]}>                                    
                                {({ remainingTime, animatedColor }) => (                                   
                                <Animated.Text
                                    style={{ ...styles.remainingTime, color: animatedColor }}>
                                    {remainingTime}
                                </Animated.Text>                               
                                )}
                            </CountdownCircleTimer>

                        <View style={styles.users}>
                        <Avatar
                            showAccessory={true}
                            size="large"
                            rounded
                            source={{uri: c_img}}
                        />
                        <Badge
                            value={c_correct}
                            status={c_status}
                            containerStyle={{ position: 'absolute', top: -4, right: 255 }}
                        />
                        
                        <Avatar
                            showAccessory={true}
                            size="large"
                            rounded
                            source={{uri: j_img}}
                        />
                        <Badge
                            value={j_correct}
                            status={j_status}
                            containerStyle={{ position: 'absolute', top: -4, right: 95 }}
                         />
                      
                        </View>
                        </View>

                        <AwesomeAlert
                            show={showAlert}
                            showProgress={false}
                            title='Whattttt?! 😧'
                            message='Do you really want to leave the game and lose?'
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showCancelButton={true}
                            showConfirmButton={true}
                            cancelText="No, Cancel"
                            confirmText="Yes, let me go"
                            confirmButtonColor={Colors.red100}
                            onCancelPressed={() => { this.onCancel()}}
                            onConfirmPressed={() => { this.leave() }}
                        />                       
                    </SafeAreaView>
                </ImageBackground>
            )
        }
        
    }
}
    
const styles = StyleSheet.create({//
    caption_j: {
        right: 95
    },
    caption_c: {
        right: 255
    },
    iconStyle: {
        alignSelf: 'flex-start'
    },
    container: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        //backgroundColor: '#ecf0f1',
        paddingHorizontal: 10,
        //flexWrap: 'wrap',
    },
    container1: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //paddingTop: Constants.statusBarHeight,
        //backgroundColor: Colors.yellow100,
        width: width/1.1,
        borderRadius: 9,
        height: height/1.3,
        alignSelf: 'center',
    },
    users:{
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: width/1.1,
        height: height/9.2,
        alignSelf: 'flex-start',
        //backgroundColor: Colors.purple500,
    },
    remainingTime: {
        fontSize: 46,
    },
    animatable: {
        textAlign: 'center', 
        position: 'absolute',
        top: 10
    },
    optionBtn: {
        fontWeight:'bold',
        fontSize: 20
    },
    btn: {
        margin: 7,
        //margin: 10,
        borderRadius: 6,
        //borderColor: Colors.greenA700,
        borderWidth: 1,
        alignItems: 'center',
        width: width/1.3,
        //
        //backgroundColor: Colors.purple500, 
    },
    questionTxt: {
        fontWeight:'bold',
        margin: 12,
        fontSize: 19,
        //justifyContent: 'center',
        textAlign: 'center',
    },
    questionCon: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        width: width/1.1,
        borderRadius: 9,
        height: height/4,
        margin: 10,
    },
    title: {
        fontWeight:'bold',
        fontSize: 20
    },
    header: {
        backgroundColor: '#8fbc8f'
    },
    item: {
        color: '#000000',
        backgroundColor: '#8fbc8f'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerTxt: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8
    },
    textStyle: {
        fontSize: 28,
        fontWeight: 'bold',
        //fontFamily: 'Menlo',
        marginBottom: 14
    }
  });
export default BoardGame;