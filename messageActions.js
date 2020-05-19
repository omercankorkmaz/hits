import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import {
  SET_MESSAGES,
  TEXT_CHANGED,
  GET_MESSAGES2,
  SET_MESSAGES_NOT_READY,
  NRF_MESSAGE_ACTIONS,
  ipCass
} from './types';
const moment = require('moment-timezone');

export const textChanged = (text) => {
  return (dispatch) => {
    dispatch({ type: TEXT_CHANGED, payload: text });
  };
};

export const clearText = () => {
  return (dispatch) => {
    dispatch({ type: TEXT_CHANGED, payload: '' });
  };
};

export const resetnrfMessageActions = () => {
  return (dispatch) => {
    dispatch({ type: NRF_MESSAGE_ACTIONS, payload: false });
  }
}

export const getMessages2 = (id) => {
  let data = [];
  let data2 = [];
  return async (dispatch) => {
    try {
      data = await AsyncStorage.getItem(`msg${id}`);
      data = JSON.parse(data);
      if (data === null) {
        dispatch({ type: GET_MESSAGES2, payload: [] });
      } else {
        data.map((item, index) =>
          data2 = [...data2, { value: index, label: item.label }]
        );
        dispatch({ type: GET_MESSAGES2, payload: data2 });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export const setMessages = (patientId, roomName, username) => {
  loc(this);
  console.log('patientId, roomName, username', patientId, roomName, username);
  let MESSAGES = [];
  let component = null;
  return async (dispatch) => {
      let deps = await AsyncStorage.getItem(`$1_$${patientId}_deps`);
      deps = JSON.parse(deps);
      let roles = await AsyncStorage.getItem(`$1_$${patientId}_roles`);
      roles = JSON.parse(roles);
      await fetch(`http://${ipCass}/get-messages/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName
      }) })
      .then((response) => response.json())
      .then((responseJson) => {
        responseJson.map(async (msg, index) => {
          if (deps.includes(msg.from_user_dep.toString()) && roles.includes(msg.from_user_role.toString())) {
            let utcTime = msg.time;
            let localTime = moment.utc(utcTime, 'YYYYMMDD HH:mm:ss');
            let timeX = localTime.clone().tz('Europe/Istanbul');
            timeX = timeX.format('MM/DD/YYYY-HH:mm:ss');
            if (msg.from_user === username) {
              component = await messageBubble(index, 'right', msg.body, msg.from_user, username, timeX);
              await MESSAGES.push(component);
            } else {
              component = await messageBubble(index, 'left', msg.body, msg.from_user, username, timeX);
              await MESSAGES.push(component);
            }
          }
        });
        rol(this);
      }).catch((error) => {
      if (error.message === 'Network request failed') {
        dispatch({ type: NRF_MESSAGE_ACTIONS, payload: true });
      }
    })
    console.log('msgs', this.MESSAGES);
    dispatch({ type: SET_MESSAGES, payload: MESSAGES });
  };
}

export const setMessagesNotReady = () => {
  return (dispatch) => {
    dispatch({ type: SET_MESSAGES_NOT_READY });
  };
}

const messageBubble = (key, dir, text, from, username, time) => {
  let leftSpacer = dir === 'left' ? null : <View style={{ width: wp('30%') }} />;
  let rightSpacer = dir === 'left' ? <View style={{ width: wp('30%') }} /> : null;
  let bubbleStyles = dir === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];
  let bubbleTextStyle = dir === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;

  let time1 = time;
  time1 = time1.split('-');
  let date = time1[0];
  time1 = time1[1];


  let time2 = time1.slice(0, -3);
  let date2 = date;
  date2 = moment(new Date(date2)).format('DD/MM/YYYY');

  if (date2 === moment().tz('Europe/Istanbul').format('DD/MM/YYYY')) {
    time1 = time2;
  } else if (date2.slice(6) === moment().tz('Europe/Istanbul').format('YYYY')) {
    time1 = `${time2}  ${date2.slice(0, 5)}`;
  } else {
    time1 = `${time2}  ${date2}`;
  }

  if (from !== username) {
    let title = from.split('$')[0];
    title = retransform(title);

    return (
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={styles.from}>
            {title}
          </Text>
          <Text style={bubbleTextStyle}>
            {text}
          </Text>
          <Text style={styles.time}>
            {time1}
          </Text>
        </View>
        {rightSpacer}
      </View>
    );
  }
  return (
    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
      {leftSpacer}
      <View style={bubbleStyles}>
        <Text style={bubbleTextStyle}>
          {text}
        </Text>
        <Text style={styles.time}>
          {time1}
        </Text>
      </View>
      {rightSpacer}
    </View>
  );
}

const retransform = (given) => {
  let parameter = given.replace(/-/g, ' ');
  parameter = parameter.toUpperCase();
  //parameter = parameter.charAt(0).toUpperCase() + parameter.slice(1);
  return parameter;
}

const styles = StyleSheet.create({

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
  time: {
    alignSelf: 'flex-end'
  }
});
