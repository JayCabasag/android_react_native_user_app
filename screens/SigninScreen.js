import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { COLORS, IMAGES } from '../utils/app_constants';
import { Dimensions } from 'react-native';
import { TextInput, Button} from 'react-native-paper';
import React, { useContext } from 'react';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { collection, getDocs, setDoc, doc, limit, orderBy, query, where, addDoc} from 'firebase/firestore/lite';
import { Base64 } from 'js-base64'
import { db } from '../firebase/firebaseConfig'
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const STUDENT_USER_TYPE = 'student'
const PROFESSOR_USER_TYPE = 'professor'

export default function SigninScreen({navigation}) {

  const [user, setUser] = useContext(UserContext)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [userTypeSelected, setUserTypeSelected] = React.useState(STUDENT_USER_TYPE)

  const goToRegister = () => {
    navigation.navigate('Signup')
  }

  const goToForgotPassword = () => {
    navigation.navigate('ForgotPassword')
  }

   React.useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@library_management_app_user_data')
        if(value !== null) {
          setUser(JSON.parse(value))
          navigation.navigate('Home')
        }
      } catch(e) {
        // error reading value
      }
    }
    getData()
  }, [])

  const storeUserData = async (value) => {
    try {
      await AsyncStorage.setItem('@library_management_app_user_data', value)
      navigation.navigate('Home')
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  const signInUser = async () => {
      const userEmailRef = query(collection(db, "users"), where("email", "==", email.toLocaleLowerCase()), where("type", "==", userTypeSelected));
      const querySnapshot = await getDocs(userEmailRef);
      let userWithSameEmail = []
      querySnapshot.forEach((doc) => {
        userWithSameEmail.push({docId: doc.id, ...doc.data()})
      });

      const userIdRef = query(collection(db, "users"), where("id", "==", email.toLocaleLowerCase()), where("type", "==", userTypeSelected));
      const querySnapshotForId = await getDocs(userIdRef);
      let userWithSameId = []
      querySnapshotForId.forEach((doc) => {
        userWithSameId.push({docId: doc.id, ...doc.data()})
      });
      
      const emailExist = userWithSameEmail?.length > 0
      const idExist = userWithSameId?.length > 0

      if(emailExist || idExist){
        const isEmail = emailExist
        const isId = idExist

        let user = []

        if(isEmail){
          const userRef = query(collection(db, "users"), where("email", "==",email.toLocaleLowerCase()), where("type", "==", userTypeSelected), where("password", "==", Base64.encode(password)));
          const querySnapshot = await getDocs(userRef);
          querySnapshot.forEach((doc) => {
            user.push({docId: doc.id, ...doc.data()})
          });
        }

        if(isId){
          const userRef = query(collection(db, "users"), where("id", "==", email.toLocaleLowerCase()), where("type", "==", userTypeSelected), where("password", "==", Base64.encode(password)));
          const querySnapshot = await getDocs(userRef);
          querySnapshot.forEach((doc) => {
            user.push({docId: doc.id, ...doc.data()})
          });
        }

        if(user?.length <= 0){
          return showMessage({
            message: `Username or password is incorrect`,
            icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
            backgroundColor: COLORS.RED
          });
        }

        if(user?.length > 0){
          const userData = {
            docId: user[0]?.docId,
            id: user[0]?.id,
            type: user[0]?.type,
            fullname: user[0]?.fullname,
            email: user[0]?.email,
            password:  user[0]?.password,
            createdAt: user[0]?.createdAt
          }
          setUser(userData)
          const convertedToStringObject = JSON.stringify(userData)
          return storeUserData(convertedToStringObject)
        }

        return 
      }

      return showMessage({
        message: `Username or password is incorrect`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
  }
  
  const handleSignInUser = () => {
    if(email?.length <= 0){
      return showMessage({
        message: `Add your ${userTypeSelected} ID or email`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }
    if(password?.length <= 0){
      return showMessage({
        message: `Please add your password`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }
    if(password?.length <= 6){
      return showMessage({
        message: `Password should contain atleast 8 letters`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }
    signInUser()
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
                <Text style={styles.loginText}>LOG IN</Text>
              </View>
              <View
              style={{display: 'flex', flexDirection:'column', paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center'}}
            >
              <View style={{display: 'flex', flexDirection: 'row', width: 320, marginTop: 10}}>
                <Button
                  color={COLORS.RED}
                  mode={userTypeSelected === STUDENT_USER_TYPE ? 'contained' : 'outlined'}
                  labelStyle={userTypeSelected === STUDENT_USER_TYPE ? {color: COLORS.WHITE} : {color: COLORS.RED}}
                  style={userTypeSelected === STUDENT_USER_TYPE ? styles.userTypeSelectorStudentActive: styles.userTypeSelectorStudent }
                  onPress={() => setUserTypeSelected(STUDENT_USER_TYPE)}
                >
                  Student
                </Button>
                <Button
                  color={COLORS.RED}
                  mode={userTypeSelected === PROFESSOR_USER_TYPE ? 'contained' : 'outlined'}
                  labelStyle={userTypeSelected === PROFESSOR_USER_TYPE ? {color: COLORS.WHITE} : {color: COLORS.RED}}
                  style={userTypeSelected === PROFESSOR_USER_TYPE ? styles.userTypeSelectorProfessorActive : styles.userTypeSelectorProfessor}
                  onPress={() => setUserTypeSelected(PROFESSOR_USER_TYPE)}
                >
                  Professor
                </Button>
              </View>
              <TextInput
                  mode='outlined'
                  label={userTypeSelected === STUDENT_USER_TYPE ? 'Student No. or Email' : 'Professor ID or Email'}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  style={styles.inputField}
                  selectionColor={COLORS.RED}
                  outlineColor={COLORS.RED}
                  underlineColor={COLORS.RED}
                  placeholderTextColor={COLORS.RED}
                  activeOutlineColor={COLORS.RED}
                />
                <TextInput
                  mode='outlined'
                  label="Password"
                  value={password}
                  onChangeText={text => setPassword(text)}
                  style={styles.inputField}
                  secureTextEntry
                  selectionColor={COLORS.RED}
                  outlineColor={COLORS.RED}
                  underlineColor={COLORS.RED}
                  placeholderTextColor={COLORS.RED}
                  activeOutlineColor={COLORS.RED}
                />
                 <View style={{display: 'flex', marginTop: 10, width: 320}}>
                  <TouchableOpacity
                    onPress={goToForgotPassword}
                  >
                    <Text style={{textAlign: 'right', alignSelf: 'flex-end', paddingRight: 10, fontWeight: '600', color: COLORS.GRAY}}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                <Button
                  mode="contained"
                  style={styles.signInButton}
                  color={COLORS.RED}
                  onPress={handleSignInUser}
                  contentStyle={{paddingVertical: 10}}
                >
                  Sign in
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
                  <Text style={{color: COLORS.GRAY, fontSize: 14, fontWeight: '600'}}>New user? </Text>
                  <TouchableOpacity
                    onPress={goToRegister}
                  >
                    <Text style={{color: COLORS.RED, fontSize: 14, fontWeight: '600'}}> Register now</Text>
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

  