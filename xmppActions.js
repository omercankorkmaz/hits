import AsyncStorage from '@react-native-community/async-storage';
import { Alert, NativeModules } from 'react-native';
import { Notifications } from 'react-native-notifications'
import { Actions, ActionConst } from 'react-native-router-flux';
import {
  MSG_ARRIVED,
  SET_USERNAME,
  SUCCESS,
  SUCCESS_ON_CONNECTING,
  SET_ROOMNAME,
  NRF_XMPP_ACTIONS,
  ON_NOTIF,
  NOTIFICATED_CHANNELS,
  RESET_NOTIF,
  SET_NOTIFICATED_CHANNELS,
  LAST_MESSAGES,
  IS_USER_MOD,
  IS_USER_MOD_FOR_CLICKED,
  ip,
  ipCass
 } from './types';
const { client, xml } = require('@xmpp/client');
const moment = require('moment-timezone');



// variable declarations for xmpp server



const onReg = async () => {
  
  // iq request for registration 
  
}

export const resetnrfXmppActions = () => {
  return (dispatch) => {
    dispatch({ type: NRF_XMPP_ACTIONS, payload: false });
  }
};

const openRoom = async (dispatch) => {
  
  // iq request for opening a new chatroom

};

export const enterRoom = (comingroomName, comingUsername) => {
  
  // iq request for entering a new chatroom
  
}

export const leaveRoom = (comingroomName, comingUsername) => {
  
  // iq request for leaving a chatroom
  
}

export const kickUser = (comingroomName, comingUsername) => {
  
  // iq request for kicking a user from a chatroom
  
}

export const makeAdmin = (comingroomName, comingUsername) => {
  
  // iq request for authorizing a user as an admin on xmpp server
  
}


export const onSendMessage = (text, comingroomName, comingUsername) => {
  
  // iq request for sending a message on a chatroom
 
}

const onPresence = async () => {
  await xmppClient.send(xml('presence'));
}

export const onStartConnect = (comingUsername) => {
  
  // iq request for connecting to the xmpp server
  
}

const onStartConnect2 = async (dispatch) => {
  
  // iq request for connecting to the xmpp server
  
  //* works when user not registered yet on xmpp server

}

export const isUserMod = (employeeId, patientId) => {
  
  // to check if user already admin on mysql
  
}

const setUserMod = (employeeId, patientId) => {
  
  // request for authorizing a user as an admin on mysql
  
}

const removeUserMod = (employeeId, patientId) => {
  
  // request for revoking administration from a user on mysql

}

const notificationOn = (dispatch, chatRoomName) => {
  
  // returns dispatch for adding badge process on mainPage
  
};

export const notNotificatedAnymore = (chatRoomName, notificatedChannels) => {
  
  // returns dispatch for removing badge process on mainPage
  
};

export const getLastMessages = () => {
  
  // returns dispatch for showing last messages per channel on mainPage

}

const addListeners = (dispatch) => {
  const removeAllListeners = () => {
      xmppClientListeners.forEach((listener) => {
        xmppClient.removeListener(listener.name, listener.callback);
      });
      xmppClientListeners = [];
  };

  removeAllListeners();

  const callbackStanza = async (stanza) => {
    
    // 147 lines of codes for checking coming stanzas (responses) from server and taking actions according to response
      
  };

  xmppClient.on('stanza', callbackStanza);
  xmppClientListeners.push({ name: 'stanza', callback: callbackStanza });

  const callbackError = async (err) => {
    if (err.text === 'Unable to authorize you with the authentication credentials you\'ve sent.') {
      await onReg();
      await onStartConnect2(dispatch);
    } else {
      dispatch({ type: NRF_XMPP_ACTIONS, payload: true }); // true
    }
  };
  
  // other connect, online, status, error, output, input and authentication situations for xmpp server

}
