import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { COLORS, IMAGES } from '../utils/app_constants';
import { Dimensions } from 'react-native';
import { TextInput, Button} from 'react-native-paper';
import React from 'react';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const STUDENT_USER_TYPE = 'student'
const PROFESSOR_USER_TYPE = 'professor'

export default function ForgotPasswordScreen({navigation}) {

  const [email, setEmail] = React.useState('')

  const goToSignIn = () => {
    navigation.navigate('Signin')
  }

    return (
        <ScrollView
          style={styles.mainScrollbar}  
          showsHorizontalScrollIndicator={false} 
          showsVerticalScrollIndicator={false}
        >
           <View style={styles.bodyContainer}>
            <Image source={{uri: IMAGES.LOGIN_BANNER_IMAGE}}
              style={{width: 250, height: 250, borderRadius: 15}} /> 
              <View style={{height: 'auto', display: 'flex', alignContent: 'center', width: 320}}>
                <Text style={styles.loginText}>Forgot password</Text>
              </View>
              <View
              style={{display: 'flex', flexDirection:'column', paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center'}}
            >
              <TextInput
                  mode='outlined'
                  label={'Email'}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  style={styles.inputField}
                  selectionColor={COLORS.RED}
                  outlineColor={COLORS.RED}
                  underlineColor={COLORS.RED}
                  placeholderTextColor={COLORS.RED}
                  activeOutlineColor={COLORS.RED}
                />
                <Button
                  mode="contained"
                  style={styles.signInButton}
                  color={COLORS.RED}
                  contentStyle={{paddingVertical: 10}}
                >
                  Send to my Email
                </Button>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginTop: 25,
                    marginBottom: 25,
                    width: 320
                  }}
                />
                <View
                  style={{
                    marginTop: -45
                  }}
                >
                  <Text style={{backgroundColor: COLORS.WHITE, padding: 10, textTransform: 'uppercase', color :COLORS.GRAY, borderRadius: 15}}>or</Text>
                </View>
                <View 
                  style={{display: 'flex', flexDirection: 'row'}}
                >
                  <Text style={{color: COLORS.GRAY, fontSize: 14, fontWeight: '600'}}>Go back to </Text>
                  <TouchableOpacity
                    onPress={goToSignIn}
                  >
                    <Text style={{color: COLORS.RED, fontSize: 14, fontWeight: '600'}}> sign in </Text>
                  </TouchableOpacity>
                </View>
              </View>
           </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  mainScrollbar: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: COLORS.WHITE,
    display: 'flex',
    flexDirection: 'column'
  },
  bodyContainer: {
    height: 'auto', 
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center',
    height: windowHeight
  },
  loginText: {
    color: COLORS.RED,
    fontWeight: '900',
    fontSize: 40
  },
  inputField: {
   marginTop: 10,
   width: 320,
   height: 60,
   backgroundColor: COLORS.WHITE
  },
  signInButton: {
    marginTop: 10, 
    width: 320
  },
  userTypeSelectorStudent: {
    flex: 1,
    marginRight: 1,
  },
  userTypeSelectorStudentActive: {
    flex: 1,
    marginRight: 1,
    backgroundColor: COLORS.RED
  },
  userTypeSelectorProfessor: {
    flex: 1,
    marginLeft: 1
  },
  userTypeSelectorProfessorActive: {
    flex: 1,
    backgroundColor: COLORS.RED,
    marginLeft: 1
  }
})

  