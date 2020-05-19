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
import { 
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
    
    // getting user's id, username for chatroom etc.
    
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
    
    // uses MessageActions for sending message

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
    // used to achieve roomname from patient's firstname-lastname-id
  }

  retransform(given) {
    // getting employee's or patient's id from username, roomname 
  }
  
  
  messageBubble(dir, text, username, time) {
    
    // Message Bubble that appears on ChatScene when message received or send
 
  }

  async start() {
    //
    //
    await this.props.setMessages(this.props.patient_id, this.props.roomName, this.state.chatroom_username); // get messages from cassandra
    //
    await this.props.getMessages2(this.state.id); // get prepared messages
    //
  }
  
  // used to render already defined messages by user
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

  render() { 
    // render contents
  }


const styles = StyleSheet.create({
  // styles
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
