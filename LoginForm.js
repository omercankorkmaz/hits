import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Logo from './Logo';
import Form from './Form';
import Wallpaper from './Wallpaper';
import ButtonSubmit from './ButtonSubmit';
import { usernameChanged, passwordChanged, resetnrfAuthActions } from '../../actions';
import bgSrc from '../images/wp9.jpeg';

class LoginForm extends Component {
  async componentWillMount() {
    await this.start();
  }

  async componentDidMount() {
    loc(this);
  }

  async start() {
    this.props.usernameChanged('');
    this.props.passwordChanged('');
    try {
      let id = await AsyncStorage.getItem('id');
      if (id !== null) {
        Actions.passing(); // if user has already signed in, no need for authentication
      }
    } catch (error) {
        console.log(error);
    }
  }

  componentWillUnMount() {
    rol();
  }

  render() {
    if (this.props.nrfAuthActions) {
      return (
        <View style={styles.container2}>
          <Text style={styles.name}> Sunucuya Bağlanılamadı. </Text>
          <Icon
            name='refresh'
            size={wp('7%')}
            color='gray'
            onPress={() => {
              this.props.resetnrfAuthActions();
              this.start();
            }}
          />
        </View>
      );
    }
    return (
      <Wallpaper img={bgSrc} type="hideNavBar" >
         <Logo />
         <Form />
         <ButtonSubmit />
       </Wallpaper>
   );
  }
}

const styles = StyleSheet.create({

   // styles
  
});

const mapStateToProps = ({ authResponse }) => {
  const { nrfAuthActions } = authResponse;
  return { nrfAuthActions };
};

export default connect(mapStateToProps, {
  usernameChanged,
  passwordChanged,
  resetnrfAuthActions
})(LoginForm);
