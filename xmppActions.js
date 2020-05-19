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

const sw = 'ec2-15-185-52-27.me-south-1.compute.amazonaws.com';

//let sw = '';
/*
fetch(`http://${ip}/get-xmpp-sw/`, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  } }).then((response) => response.json())
.then((responseJson) => {
  sw = responseJson.message;
})
.catch((error) => {
  console.log('error', error);
});
*/
let username = '';
let roomname = '';
let lastMessages = [];
let lastMessageData = {};
let from_user_dep_id = null;
let from_user_role_id = null;
let xmppClientListeners = [];
let xmppClient = client({ service: 'ws://' + sw + ':5280/xmpp-websocket',
                          domain: sw,
                          resource: '',
                          username: '',
                          password: '', });
const XMPPServerOptions = { uri: 'ws://' + sw + ':5280/xmpp-websocket', domain: sw };

const onReg = async () => {
  await xmppClient.iqCaller.request(
    xml('iq', { type: 'get' }, xml('query', 'jabber:iq:register')),
    30 * 1000, // 30 seconds timeout - default
    sw
  );
  await xmppClient.iqCaller.request(
    xml('iq', { type: 'set' }, xml('query', 'jabber:iq:register',
               xml('username').t(username), xml('password').t('123123'))
   ),
    30 * 1000, // 30 seconds timeout - default
    sw
  );
}
/*
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
*/
export const resetnrfXmppActions = () => {
  return (dispatch) => {
    dispatch({ type: NRF_XMPP_ACTIONS, payload: false });
  }
};

const openRoom = async (dispatch) => {
  console.log('openRoom"a girdi');
  console.log('username', username);
  console.log('roomname', roomname);
  xmppClient.iqCaller.request(
    xml('iq', { type: 'set', from: username + '@' + sw, to: roomname + '@conference.' + sw + '/' + comingUsername },
    xml('query', 'http://jabber.org/protocol/muc#owner',
    xml('x', { xmlns: 'jabber:x:data', type: 'submit' })) // decide rooms configs
    ),
    30 * 1000, // 30 seconds timeout - default
  );
   dispatch({ type: SUCCESS });
};

export const enterRoom = (comingroomName, comingUsername) => {
  roomname = comingroomName;
  username = comingUsername;
  console.log('enterRoom"a girdi');
  console.log('username', username);
  console.log('roomname', roomname);
  return async (dispatch) => {
    await xmppClient.send(xml('presence',
      { from: comingUsername + '@' + sw, to: comingroomName + '@conference.' + sw + '/' + comingUsername },
        xml('x', { xmlns: 'http://jabber.org/protocol/muc' }),
        //xml('item', xml('nick', { xmlns: 'http://jabber.org/protocol/nick' }))
      ));
    dispatch({ type: SUCCESS });
  };
}

export const leaveRoom = (comingroomName, comingUsername) => {
  console.log('comingroomName', comingroomName);
  console.log('comingUsername', comingUsername);
  let employeeId = comingUsername.split('$')[1];
  let patientId = comingroomName.split('$')[1];
  removeUserMod(employeeId, patientId);
  return async (dispatch) => {
    xmppClient.send(xml('presence',
     { from: comingUsername + '@' + sw, to: comingroomName + '@conference.' + sw + '/' + comingUsername, type: 'unavailable' }));
    dispatch({ type: SUCCESS });
  }
}

export const kickUser = (comingroomName, comingUsername) => {
  return async (dispatch) => {
    xmppClient.iqCaller.request(
      xml('iq', { type: 'set', to: comingroomName + '@conference.' + sw },
      xml('query', 'http://jabber.org/protocol/muc#admin',
      xml('item', { nick: comingUsername, role: 'none' })) // decide rooms configs
      ),
      30 * 1000, // 30 seconds timeout - default
    );
    dispatch({ type: SUCCESS });
  }
}
/*
<iq id='kick1'
to='harfleur@henryv.shakespeare.lit'
type='set'>
<query xmlns='http://jabber.org/protocol/muc#admin'>
<item nick='pistol' role='none'>
</item>
</query>
</iq>
*/

export const makeAdmin = (comingroomName, comingUsername) => {
  console.log('comingroomName makeAdmin', comingroomName);
  console.log('comingUsername makeAdmin', comingUsername);
  let employeeId = comingUsername.split('$')[1];
  let patientId = comingroomName.split('$')[1];
  if (isUserMod2(employeeId, patientId) === false) {
    setUserMod(employeeId, patientId);
  }
  return async (dispatch) => {
    xmppClient.iqCaller.request(
      xml('iq', { type: 'set', to: comingroomName + '@conference.' + sw },
      xml('query', 'http://jabber.org/protocol/muc#admin',
      xml('item', { nick: comingUsername, role: 'moderator' })) // decide rooms configs
      ),
      30 * 1000, // 30 seconds timeout - default
    );
    dispatch({ type: SUCCESS });
  }
}

/*
<iq id='mod1'
to='coven@chat.shakespeare.lit'
type='set'>
<query xmlns='http://jabber.org/protocol/muc#admin'>
<item nick='thirdwitch'
role='moderator'/>
</query>
</iq>
*/

export const onSendMessage = (text, comingroomName, comingUsername) => {
  return (dispatch) => {
    const stanzaParams = {
     from: comingUsername + '@' + sw,
     to: comingroomName + '@conference.' + sw,
     type: 'groupchat',
     id: Math.floor(Math.random() * Math.floor(999999999))
    };

    const messageStanza = xml('message', stanzaParams);

    messageStanza.c('body', {
      xmlns: 'jabber:client',
      })
      .t(text)
      .up();
    messageStanza.c('time').t(moment().tz('Europe/Istanbul').format('HH:mm:ss'));
    messageStanza.c('date').t(moment().tz('Europe/Istanbul').format('MM/DD/YYYY'));
    //xmppClient.send(xml('presence'));
    xmppClient.send(messageStanza);
    dispatch({ type: SUCCESS });
  }
}

const onPresence = async () => {
  await xmppClient.send(xml('presence'));
}

export const onStartConnect = (comingUsername) => {
  username = comingUsername;
  return async (dispatch) => {
    xmppClient = client({ service: 'ws://'+ sw +':5280/xmpp-websocket',
                          domain: sw,
                          resource: '',
                          username,
                          password: '123123', });
    addListeners(dispatch);
    await xmppClient.start(XMPPServerOptions);
    dispatch({ type: SUCCESS_ON_CONNECTING, payload: true });
  }
}

const onStartConnect2 = async (dispatch) => {
  console.log('onStartConnect2');
  xmppClient = client({ service: 'ws://'+ sw +':5280/xmpp-websocket',
                        domain: sw,
                        resource: '',
                        username,
                        password: '123123', });
  addListeners(dispatch);
  await xmppClient.start(XMPPServerOptions);
  dispatch({ type: SUCCESS_ON_CONNECTING, payload: true });
}

export const setChatroomName = (title, id) => {
  console.log('------------->setChatroomName', title, id);
  return async (dispatch) => {
    let roomName = title;
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
    dispatch({ type: SET_ROOMNAME, payload: roomName });
  }
}

export const isUserMod = (employeeId, patientId) => {
  console.log('employeeId', employeeId);
  console.log('patientId', patientId);
  let isUsernameXmppMod = false;
  return (dispatch) => {
    fetch(`http://${ip}/is-user-mod`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId, patientId
      }) }).then((response) => response.json())
    .then((responseJson) => {
      isUsernameXmppMod = responseJson.length !== 0;
      dispatch({ type: IS_USER_MOD, payload: isUsernameXmppMod });
    }).catch((error) => {
      if (error.message === 'Network request failed') {
        console.log('error on isUserMod', error);
        dispatch({ type: NRF_XMPP_ACTIONS, payload: true });
      }
    });
  };
}

export const isUserModForClickled = (employeeId, patientId) => {
  console.log('employeeId', employeeId);
  console.log('patientId', patientId);
  let isUsernameXmppMod = false;
  return (dispatch) => {
    fetch(`http://${ip}/is-user-mod`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        employeeId, patientId
      }) }).then((response) => response.json())
    .then((responseJson) => {
      isUsernameXmppMod = responseJson.length !== 0;
      console.log('isUserModForClickled', isUsernameXmppMod);
      dispatch({ type: IS_USER_MOD_FOR_CLICKED, payload: isUsernameXmppMod });
    }).catch((error) => {
      if (error.message === 'Network request failed') {
        console.log('error on isUserMod', error);
        dispatch({ type: NRF_XMPP_ACTIONS, payload: true });
      }
    });
  };
}

const isUserMod2 = (employeeId, patientId) => {
  let isUsernameXmppMod = false;
  fetch(`http://${ip}/is-user-mod`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      employeeId, patientId
    }) }).then((response) => response.json())
  .then((responseJson) => {
    isUsernameXmppMod = responseJson.length !== 0;
    isUsernameXmppMod = true;
  }).catch((error) => {
    if (error.message === 'Network request failed') {
      console.log('error on isUserMod2', error);
    }
  });
  return isUsernameXmppMod;
}

const setUserMod = (employeeId, patientId) => {
  fetch(`http://${ip}/set-user-mod`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      employeeId, patientId
    }) }).then((response) => response.json())
  .then((responseJson) => {

  }).catch((error) => {
    if (error.message === 'Network request failed') {
      console.log('error on setUserMod', error);
    }
  });
}

const removeUserMod = (employeeId, patientId) => {
  fetch(`http://${ip}/remove-user-mod`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      employeeId, patientId
    }) }).then((response) => response.json())
  .then((responseJson) => {

  }).catch((error) => {
    if (error.message === 'Network request failed') {
      console.log('error on removeUserMod', error);
    }
  });
}

const transformer = (given) => {
  let parameter = given.replace(/Ğ/g,'g')
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
  parameter = parameter.toLowerCase();
  return parameter;
}

const notificationOn = (dispatch, chatRoomName) => {
  dispatch({ type: ON_NOTIF, payload: chatRoomName });
};

export const notificationOn2 = (chatRoomName) => {
  return (dispatch) => {
    dispatch({ type: ON_NOTIF, payload: chatRoomName });
  }
};

export const resetNotification = () => {
  return (dispatch) => {
    dispatch({ type: RESET_NOTIF });
  };
};

export const notNotificatedAnymore = (chatRoomName, notificatedChannels) => {
  let newNotificatedChannels = [];
  if (notificatedChannels.length !== 0) {
    newNotificatedChannels = notificatedChannels.filter((value) => {
      return value !== chatRoomName;
    })
  }
  console.log('newNotificatedChannels', newNotificatedChannels);
  return (dispatch) => {
    dispatch({ type: SET_NOTIFICATED_CHANNELS, payload: newNotificatedChannels });
  };
};

export const getLastMessages = () => {
  return (dispatch) => {
    dispatch({ type: LAST_MESSAGES, payload: lastMessages });
  }
}

const addListeners = (dispatch) => {
  const removeAllListeners = () => {
      xmppClientListeners.forEach((listener) => {
        xmppClient.removeListener(listener.name, listener.callback);
      });
      xmppClientListeners = [];
  };

  removeAllListeners();

  const callbackConnect = () => {
      console.log('CONNECTING');
  };
  xmppClient.on('connect', callbackConnect);
  xmppClientListeners.push({ name: 'connect', callback: callbackConnect });

  const callbackOnline = (jid) => {
      console.log('ONLINE');
  };
  xmppClient.on('online', callbackOnline);
  xmppClientListeners.push({ name: 'online', callback: callbackOnline });

  const callbackStatus = (status, value) => {
  };
  xmppClient.on('status', callbackStatus);
  xmppClientListeners.push({ name: 'status', callback: callbackStatus });

  const retransform = (given) => {
    let parameter = given.replace(/-/g, ' ');
    parameter = parameter.toUpperCase();
    return parameter;
  }

  const callbackStanza = async (stanza) => {
      if (stanza.is('presence')) {
        if (stanza.getChild('error')) {
          stanza.getChild('error').children.map(async (data) => {
            if (data.name === 'item-not-found') {
              await openRoom(dispatch);
            }
          });
        }

        stanza.children.map((data) => {
          if (data.name === 'x') {
            if (data.children.length !== 0) {
              data.children.map(async (data2) => {
                if (data2.attrs.code === '201') {
                  let userId = username.split('$')[1];
                  let patientId = roomname.split('$')[1];
                  if (isUserMod2(userId, patientId) === false) {
                    setUserMod(userId, patientId);
                  }
                }
              });
            }
          }
        });

        /*else if (stanza.getChild('x')) {
          console.log("stanza.getChild('x')", stanza.getAllChild('x'));
        }*/
        console.log('On PRESENCE:' + stanza);
      } else if (stanza.is('iq')) {
        console.log('On IQ:' + stanza);
      } else if (stanza.is('message')) {
        if (stanza.getChild('body')) {
          console.log('On MESSAGE:' + stanza.getChild('body').text());
          let deps = [];
          let roles = [];
          let from = stanza.attrs.from.split('/');
          from = from[1];
          let username_msg = from;                                          // omer-can-korkmaz$1
          from = from.split('$');
          let employee_id = from[1];                                    // 1 // Mesajı atan kişi
          await fetch(`http://${ip}/get-employee-dep-role/`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              employee_id
          }) }).then((response) => response.json())
          .then((responseJson) => {
            console.log('responseJson', responseJson);
            from_user_dep_id = responseJson[0].department_id.toString();
            from_user_role_id = responseJson[0].role_id.toString();
          })
          .catch((error) => {
            console.log(error);
          });
          let usernameTransformed = retransform(from[0]);               // OMER CAN KORKMAZ
          let from2 = stanza.attrs.from.split('@');
          let roomname_msg = from2[0];                                  // alper-cesur$1
          let titleTransformed = stanza.attrs.from.split('@');          // alper-cesur$1
          titleTransformed = titleTransformed[0].split('$');
          let to_patient_id = titleTransformed[1];                                 // 1
          titleTransformed = titleTransformed[0];                       // alper-cesur
          let titleNotTransformed = Actions.currentParams.title;
          titleNotTransformed = transformer(titleNotTransformed);       // alper-cesur
          user_id = username.split('$');
          user_id = user_id[1];
          deps = await AsyncStorage.getItem(`$${user_id}_$${to_patient_id}_deps`);
          deps = JSON.parse(deps);
          roles = await AsyncStorage.getItem(`$${user_id}_$${to_patient_id}_roles`);
          roles = JSON.parse(roles);
          if (!stanza.getChild('delay')) {
            if (Actions.currentScene === 'chatScene' && titleTransformed === titleNotTransformed) {
              if (username_msg === username) {
                await messageArrived(
                  stanza.getChild('body').text(),
                  username_msg,
                  roomname_msg,
                  `${stanza.getChild('date').text()}-${stanza.getChild('time').text()}`
                );
              } else if (deps.includes(from_user_dep_id) && roles.includes(from_user_role_id)) {
                  await messageArrived(
                    stanza.getChild('body').text(),
                    username_msg,
                    roomname_msg,
                    `${stanza.getChild('date').text()}-${stanza.getChild('time').text()}`
                  );
                }
            } else if (Actions.currentScene !== 'chatScene' || titleTransformed !== titleNotTransformed) {
              if (deps.includes(from_user_dep_id) && roles.includes(from_user_role_id) && username_msg !== username) {
                notificationOn(dispatch, roomname_msg);
                Notifications.postLocalNotification({
                    title: `${retransform(titleTransformed)}'ın kanalında yeni mesaj`,
                    body: `${usernameTransformed}: ${stanza.getChild('body').text()}`,
                    newMessageOn: roomname_msg,
                    newMessageOnId: to_patient_id
                });
              }
              //this.props.newMessage(titleTransformed);
            }
            if (username_msg === username) {
              fetch(`http://${ipCass}/add-new-message`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                }, //stanza.getChild('date').text()
                body: JSON.stringify({
                  from_user: username_msg,
                  to_group: roomname_msg,
                  time: `${stanza.getChild('date').text()}-${stanza.getChild('time').text()}`,
                  body: stanza.getChild('body').text(),
                  from_user_dep: from_user_dep_id,
                  from_user_role: from_user_role_id
              }) }).then((response) => response.json())
              .then((responseJson) => {
                console.log(responseJson);
              }).catch((error) => {
                console.error(error);
              });
            }
          }
          if (deps.includes(from_user_dep_id) && roles.includes(from_user_role_id)) {
            lastMessageData = {
              lastMessage: stanza.getChild('body').children[0],
              to: roomname_msg,
              username: username_msg,
              time: `${stanza.getChild('date').text()}-${stanza.getChild('time').text()}`
            };

            if (lastMessages.length === 0) {
              lastMessages.push(lastMessageData);
            } else {
              lastMessages.map((data, index) => {
                if (data.to === lastMessageData.to) {
                  lastMessages.splice(index, index + 1);
                }
                lastMessages.push(lastMessageData);
              });
            }
            Actions.refresh();
          }
        } else {
          console.log('On MESSAGE:' + stanza);
        }
      }
  };

  const messageArrived = (parameter1, parameter2, parameter3, parameter4) => {
    const data = { msg: parameter1, username: parameter2, chatroomName: parameter3, time: parameter4 };
    dispatch({ type: MSG_ARRIVED, payload: data });
  }

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

  xmppClient.on('error', callbackError);
  xmppClientListeners.push({ name: 'error', callback: callbackError });

  const callbackOutput = (str) => {
    console.log('SENT:', str);
  };

  xmppClient.on('output', callbackOutput);
  xmppClientListeners.push({ name: 'output', callback: callbackOutput });

  const callbackInput = (str) => {
    //console.log('RECV:', str);
  };
  xmppClient.on('input', callbackInput);
  xmppClientListeners.push({ name: 'input', callback: callbackInput });

  const callbackAuthenticate = (authenticate) => {
    console.log('AUTHENTICATING');

    return authenticate(this.XMPPUserCredentials.jidLocalPart,
      this.XMPPUserCredentials.password)
  };
  xmppClient.on('authenticate', callbackAuthenticate);
  xmppClientListeners.push({ name: 'authenticate', callback: callbackAuthenticate });
}
