import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Dialog, { FadeAnimation, DialogContent, DialogTitle, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AutogrowInput from 'react-native-autogrow-input';
import { connect } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import { setPatientInfo,
  setMessages,
  textChanged,
  getMessages2,
  clearText,
  setMessagesNotReady,
  enterRoom,
  onSendMessage,
  setChatroomName,
  resetnrfMessageActions,
  resetnrfUserActions,
  resetnrfXmppActions,
  getBSSID,
  resetState,
  notNotificatedAnymore,
  getEmployeePermissions
 } from '../../actions';
import Wallpaper from '../loginComponent/Wallpaper';
import bgSrc from '../images/wp10.jpg';

class ChatScene extends Component {
  state = {
    id: null,
    visiblePreparedMessages: false,
    clickedPreparedMessage: null,
    preparedMessages: [],
    addButtonColor: 'gray',
    newComingMessages: [],
    allowedWifi: null,
    chatroom_username: ''
  }

  async componentWillMount() {
    await this.props.setChatroomName(this.props.title, this.props.patient_id);
    const id = await AsyncStorage.getItem('id');
    const chatroom_username = await AsyncStorage.getItem('chatroom_username');
    this.setState({ id, chatroom_username });
    await this.props.getEmployeePermissions(id);
    if (!this.props.canWifiOutside) {
      await this.props.resetState();
      await this.props.getBSSID();
    }
    await this.start();
  }

  async componentDidMount() {
    loc(this);
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.arrivedMessage !== this.props.arrivedMessage) {
      let temp = this.state.newComingMessages;
      let component = null;
      if (this.props.arrivedMessage.username === this.state.chatroom_username) {
        component = this.messageBubble('right', this.props.arrivedMessage.msg, this.props.arrivedMessage.username, this.props.arrivedMessage.time);
      } else {
        component = this.messageBubble('left', this.props.arrivedMessage.msg, this.props.arrivedMessage.username, this.props.arrivedMessage.time);
      }
      temp = [...temp, component];
      this.setState({ newComingMessages: temp });
    } else if (prevProps.isItAllowed !== this.props.isItAllowed) {
      if (this.props.isItAllowed) {
        console.log('devamke');
        this.setState({ allowedWifi: true });
      }
    } else if (prevProps.modal !== this.props.modal) {
      console.log('yoo');
      this.setState({ allowedWifi: false });
    } else if (prevProps.roomName !== this.props.roomName) {
      await this.props.notNotificatedAnymore(this.props.roomName, this.props.notificatedChannels2);
    }
  }

  componentWillUnmount() {
    rol();
    this.props.setMessagesNotReady();
  }

  async onSendPressed() {
    await this.props.onSendMessage(this.props.text, this.props.roomName, this.state.chatroom_username);
    await this.props.clearText();
  }

  setText(messageIndex) {
    this.props.preparedMessages.map((item) => {
      if (item.value === messageIndex) {
        this.setState({ clickedPreparedMessage: item.label });
      }
    });
    this.props.textChanged(this.state.clickedPreparedMessage);
  }

  setChatroomName(title, id) {
    let roomName = title;
    console.log('----->roomName, id', roomName, id);
    roomName = roomName.replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/I/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ /g, '-');
    roomName = roomName.toLowerCase();
    roomName = `${roomName}$${id}`;
    return roomName;
  }

  retransform2(given) {
    console.log('----->given', given);
    let parameter = given.replace(/-/g, ' ');
    parameter = parameter.toUpperCase();
    parameter = parameter.split('$')[0];
    return parameter;
  }

  messageBubble(dir, text, username, time) {
    let leftSpacer = dir === 'left' ? null : <View style={{ width: wp('30%') }} />;
    let rightSpacer = dir === 'left' ? <View style={{ width: wp('30%') }} /> : null;
    let bubbleStyles = dir === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];
    let bubbleTextStyle = dir === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;
    time = time.split('-');
    time = time[1];
    time = time.slice(0, -3);
    if (dir === 'left') {
      const usernameTransformed = this.retransform2(username);
      return (
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          {leftSpacer}
          <View style={bubbleStyles}>
            <Text style={styles.from}>
              {usernameTransformed}
            </Text>
            <Text style={bubbleTextStyle}>
              {text}
            </Text>
            <Text style={styles.time}>
              {time}
            </Text>
          </View>
          {rightSpacer}
        </View>
      );
    } else if (dir === 'right') {
      return (
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          {leftSpacer}
          <View style={bubbleStyles}>
            <Text style={bubbleTextStyle}>
              {text}
            </Text>
            <Text style={styles.time}>
              {time}
            </Text>
          </View>
          {rightSpacer}
        </View>
      );
    }
  }

  async start() {
    await this.props.setMessagesNotReady();
    this.props.clearText();
    await this.props.setMessages(this.props.patient_id, this.props.roomName, this.state.chatroom_username);
    await this.props.setPatientInfo(this.props.patient_id); //patientInfo //userActions
    await this.props.getMessages2(this.state.id); //preparedMessages
    this.setState({ allDone: true });
  }

  renderDialogPreparedMessages() {
    return (
      <Dialog
        visible={this.state.visiblePreparedMessages}
        width={340}
        onTouchOutside={() => {
          this.setState({ visiblePreparedMessages: false });
          this.setState({ addButtonColor: 'gray' });
        }}
        dialogAnimation={new FadeAnimation({
          initialValue: 0, // optional
          animationDuration: 150, // optional
          useNativeDriver: true, // optional
        })}
        dialogTitle={<DialogTitle title="Hazır Mesajlarınız" />}
        footer={
          <DialogFooter>
            <DialogButton
              text="VAZGEÇ"
              onPress={() => {
                this.setState({ visiblePreparedMessages: false });
                this.setState({ addButtonColor: 'gray' });
              }}
              textStyle={{ color: 'gray' }}
            />
          </DialogFooter>
        }
      >
        <DialogContent>
          <View style={{ marginTop: 10 }}>
            <RadioForm
              radio_props={this.props.preparedMessages}
              initial={-1}
              onPress={async (value) => {
                await this.setState({ visiblePreparedMessages: false });
                await this.setText(value);
                await this.setState({ addButtonColor: 'gray' });
              }}
              buttonColor={'gray'}
              animation
              buttonInnerColor={'gray'}
              buttonOuterColor={'gray'}
            />
          </View>
        </DialogContent>
      </Dialog>
    )
  }

  render() { //this.props.messagesReady &&
    if (!this.props.nrfMessageActions && !this.props.nrfUserActions && !this.props.nrfXmppActions && this.props.messagesReady) {
      if (this.state.allowedWifi === false) {
        return (
          <Wallpaper img={bgSrc} type="hideNavBar">
            <ScrollView style={styles.container}>
              <Text style={styles.header}>
                Aşağıdaki Ağlardan birine bağlanmanız gerekmektedir
              </Text>
              {this.props.modal}
            </ScrollView>
          </Wallpaper>
        );
      } else if (this.state.allowedWifi) {
        return (
          <Wallpaper img={bgSrc} type="hideNavBar">
            <View style={styles.header}>
              <View style={{ justifyContent: 'center', width: wp('20%'), alignItems: 'center' }}>
                <Icon
                  name='arrow-left'
                  size={30}
                  color='#fa9191'
                  onPress={() => {
                    this.props.notNotificatedAnymore(this.props.roomName, this.props.notificatedChannels2);
                    Actions.main();
                  }}
                />
              </View>
              <View style={{ justifyContent: 'center', width: wp('60%'), alignItems: 'center' }}>
                <Text style={styles.name}>Hasta Adı: {this.props.title}</Text>
              </View>
              <View style={{ justifyContent: 'center', width: wp('20%'), alignItems: 'center' }}>
                <Icon
                  name='arrow-right'
                  size={30}
                  color='#fa9191'
                  onPress={() => Actions.patientProfile({
                    title: this.props.title,
                    patient_id: this.props.patient_id,
                  })}
                />
              </View>
            </View>

            <View style={styles.outer}>

                <ScrollView ref={(ref) => { this.scrollView = ref; }} style={styles.messages} onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>
                  {this.props.messages}
                  {this.state.newComingMessages}
                </ScrollView>

                <View style={styles.inputBar}>
                  <Icon
                    name='comment-plus-outline'
                    size={40}
                    color={this.state.addButtonColor}
                    onPress={() => {
                      this.setState({ visiblePreparedMessages: true });
                      this.setState({ addButtonColor: 'green' });
                    }}
                  />
                  <AutogrowInput
                   style={styles.textBox}
                   ref={(ref) => { this.autogrowInput = ref; }}
                   multiline
                   defaultHeight={30}
                   onChangeText={(value) => this.props.textChanged(value)} // (value) => this.setState({ text: value })
                   value={this.props.text} // this.state.text
                  />
                  <Icon
                   name='send-circle'
                   size={40}
                   color={this.props.text ? 'green' : 'gray'}
                   onPress={() => {
                     if (this.props.text !== '') {
                       this.onSendPressed();
                     }
                   }}
                  />
                 </View>

                 {this.renderDialogPreparedMessages()}

             </View>
          </Wallpaper>
        );
      }
    }
    if (this.props.nrfMessageActions || this.props.nrfUserActions || this.props.nrfXmppActions) {
      return (
        <View style={styles.container2}>
          <Text style={styles.name}> Sunucuya Bağlanılamadı. </Text>
          <Icon
            name='refresh'
            size={wp('7%')}
            color='gray'
            onPress={async () => {
              await this.props.resetnrfMessageActions();
              await this.props.resetnrfXmppActions();
              await this.props.resetnrfUserActions();
              this.start();
            }}
          />
        </View>
      );
    } else if (!this.props.nrfMessageActions && !this.props.nrfUserActions && !this.props.nrfXmppActions) {
      return (
        <View style={styles.container2}>
          <ActivityIndicator size="large" color="#ff0000" />
        </View>
      );
    }
  }
}


const styles = StyleSheet.create({
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  messages: {
    flex: 1
  },
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: wp('5%'),
    paddingHorizontal: 10
  },
  messageBubble: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'column',
    flex: 1
  },
  messageBubbleLeft: {
    backgroundColor: '#D7D7D7',
  },
  from: {
    color: '#3399FF',
    fontSize: wp('3%')
  },
  messageBubbleTextLeft: {
    color: 'black',
    fontSize: wp('5%')
  },
  messageBubbleRight: {
    backgroundColor: '#CEF0D5'
  },
  messageBubbleTextRight: {
    color: 'black',
    fontSize: wp('5%')
  },
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#faf2f2',
    height: hp('8%'),
    borderColor: '#ffc7c7',
    elevation: 3,
    flexDirection: 'row',
  },
  name: {
    fontSize: wp('6%'),
    color: '#eb6383',
    fontWeight: '600',
  },
  time: {
    alignSelf: 'flex-end'
  }
});

const mapStateToProps = ({ userResponse, messageResponse, xmppResponse, wifiResponse }) => {
  const { patientInfo, nrfUserActions, canWifiOutside } = userResponse;
  const { isItAllowed, modal } = wifiResponse;
  const { messages, text, preparedMessages, messagesReady, nrfMessageActions } = messageResponse;
  const { arrivedMessage, nrfXmppActions, roomName } = xmppResponse;
  return {
    nrfXmppActions,
    nrfUserActions,
    nrfMessageActions,
    patientInfo,
    messages,
    text,
    preparedMessages,
    messagesReady,
    arrivedMessage,
    isItAllowed,
    modal,
    canWifiOutside,
    roomName
   };
};

export default connect(mapStateToProps, {
  setPatientInfo,
  setMessages,
  textChanged,
  getMessages2,
  clearText,
  setMessagesNotReady,
  enterRoom,
  onSendMessage,
  setChatroomName,
  resetnrfMessageActions,
  resetnrfUserActions,
  resetnrfXmppActions,
  getBSSID,
  resetState,
  notNotificatedAnymore,
  getEmployeePermissions
 })(ChatScene);
