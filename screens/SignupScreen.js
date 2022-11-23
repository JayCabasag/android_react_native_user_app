import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, IMAGES } from '../utils/app_constants';
import { Dimensions } from 'react-native';
import { TextInput, Button, Checkbox} from 'react-native-paper';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { collection, getDocs, setDoc, doc, limit, orderBy, query, where, addDoc, serverTimestamp} from 'firebase/firestore/lite';
import { Base64 } from 'js-base64'
import { db } from '../firebase/firebaseConfig'


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const STUDENT_USER_TYPE = 'student'
const PROFESSOR_USER_TYPE = 'professor'

export default function SignupScreen({navigation}) {

  const [email, setEmail] = React.useState('')
  const [userId, setUserId] = React.useState('')
  const [fullname, setFullname] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [retypedPassword, setRetypedPassword] = React.useState(false)
  const [userTypeSelected, setUserTypeSelected] = React.useState(STUDENT_USER_TYPE)
  const [agreedToTermsAndConditionsPolicies, setAgreedToTermsAndConditionsPolicies] = React.useState(false)

  const goToRegister = () => {
    navigation.navigate('Signin')
  }

  const storeUserData = async (value) => {
    try {
      await AsyncStorage.setItem('@library_management_app_user_data', value)
      return showMessage({
        message: `Registered successfully`,
        type: 'success'
      });
    } catch (e) {
      // saving error
    }
  }

  const registerUserToDatabase = async (user) => {
    
    const userEmailRef = query(collection(db, "users"), where("email", "==", user.email));
    const querySnapshot = await getDocs(userEmailRef);
    let userWithSameEmail = []
    querySnapshot.forEach((doc) => {
      userWithSameEmail.push({docId: doc.id, ...doc.data()})
    });
    const emailAlreadyInUse = userWithSameEmail?.length > 0
    if(emailAlreadyInUse){
      return showMessage({
        message: `${user?.email} is already in used by other user.`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }

    const userIdRef = query(collection(db, "users"), where("id", "==", user.id));
    const querySnapshotForId = await getDocs(userIdRef);
    let userWithSameId = []
    querySnapshotForId.forEach((doc) => {
      userWithSameId.push({docId: doc.id, ...doc.data()})
    });

    const idAlreadyInUse = userWithSameId?.length > 0
    if(idAlreadyInUse){
      return showMessage({
        message: `${user?.id} is already in used by other user.`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }
  
    await addDoc(collection(db, "users"), {
      ...user,
      createdAt: serverTimestamp()
    }).then((response) => {
      const docId = response.id
      const convertedToStringUserDataObject = JSON.stringify(user)
      storeUserData(convertedToStringUserDataObject)
      navigation.navigate('Signin')
    }).catch(() => {
      return showMessage({
        message: `Error registering user. Please try again`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    })

    // Add to history of registree
    await addDoc(collection(db, "transactions"), {
      ...user,
      createdAt: serverTimestamp()
    }).then((response) => {

    }).catch(() => {

    })
  }

  const handleRegisterUser = () => {

    const validateEmail = (text) => {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(text) === false) {
        return true;
      }
      else {
        return false
      }
    }

    const isValidateStudentId = (text) => {
      let reg = /\d{2}-\d{3}/gm;
      
      if (reg.test(text) === false) {
        return false;
      }
      else {
        return true
      }
    }

    if(userId.length <= 0){
      return showMessage({
        message: `Please add your ${userTypeSelected} ID number`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }
    if(userTypeSelected === 'student' && !isValidateStudentId(userId)){
      return showMessage({
        message: `Your student ID number is invalid e.g. 18-01***`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }
    if(fullname.length <= 0){
      return showMessage({
        message: `Please add your fullname`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }

    if(email.length <= 0){
      return showMessage({
        message: `Please add your email`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }
    if(validateEmail(email)){
      return showMessage({
        message: `Email format is incorrect`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }
    

    if(password.length <= 0){
      return showMessage({
        message: `Please add your password`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }

    if(password.length <= 6){
      return showMessage({
        message: `Please should contain atleast 7 letters`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }

    if(retypedPassword.length <= 6){
      return showMessage({
        message: `Please retype your password`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }

    if(password !== retypedPassword){
      return showMessage({
        message: `Please make sure password and retypes password is same.`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }

    if(!agreedToTermsAndConditionsPolicies){
      return showMessage({
        message: `Please agree our terms and conditons policies.`,
        icon: props => <Entypo name="circle-with-cross" size={22} color={COLORS.WHITE} {...props}/>,
        backgroundColor: COLORS.RED
      });
    }

    const user = {
      id: userId,
      type: userTypeSelected,
      fullname: fullname,
      email: email.toLocaleLowerCase(),
      password: Base64.encode(retypedPassword)
    }

    registerUserToDatabase(user)
  }

  return (
        <ScrollView
          style={styles.mainScrollbar}  
          showsHorizontalScrollIndicator={false} 
          showsVerticalScrollIndicator={false}
        >
            <FlashMessage 
              hideStatusBar={false}
              statusBarHeight={StatusBar.currentHeight}
            />
          <View style={styles.bodyContainer}> 
              <View style={{height: 'auto', display: 'flex', alignContent: 'center', width: 320}}>
                <Text style={styles.loginText}>REGISTER </Text>
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
                  label={userTypeSelected === STUDENT_USER_TYPE ? 'Student No.' : 'Professor ID'}
                  value={userId}
                  onChangeText={text => setUserId(text)}
                  style={styles.inputField}
                  selectionColor={COLORS.RED}
                  outlineColor={COLORS.RED}
                  underlineColor={COLORS.RED}
                  placeholderTextColor={COLORS.RED}
                  activeOutlineColor={COLORS.RED}
                />
                <TextInput
                  mode='outlined'
                  label={'Fullname'}
                  value={fullname}
                  onChangeText={text => setFullname(text)}
                  style={styles.inputField}
                  selectionColor={COLORS.RED}
                  outlineColor={COLORS.RED}
                  underlineColor={COLORS.RED}
                  placeholderTextColor={COLORS.RED}
                  activeOutlineColor={COLORS.RED}
                />
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
                 <TextInput
                  mode='outlined'
                  label="Re-type password"
                  value={retypedPassword}
                  onChangeText={text => setRetypedPassword(text)}
                  style={styles.inputField}
                  secureTextEntry
                  selectionColor={COLORS.RED}
                  outlineColor={COLORS.RED}
                  underlineColor={COLORS.RED}
                  placeholderTextColor={COLORS.RED}
                  activeOutlineColor={COLORS.RED}
                />
                 <View 
                  style={{display: 'flex', flexDirection: 'row', width: 320, marginTop: 10, alignItems: 'center'}}
                >   
                  <Checkbox
                    color={COLORS.RED}
                    status={agreedToTermsAndConditionsPolicies ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setAgreedToTermsAndConditionsPolicies(!agreedToTermsAndConditionsPolicies);
                    }}
                  />
                  <Text style={{color: COLORS.GRAY, fontSize: 14, fontWeight: '600'}}>Agree to our</Text>
                  <TouchableOpacity
                    onPress={goToRegister}
                  >
                    <Text style={{color: COLORS.RED, fontSize: 14, fontWeight: '600'}}> Terms and Condition Policies</Text>
                  </TouchableOpacity>
                </View>
                <Button
                  mode="contained"
                  style={styles.signInButton}
                  color={COLORS.RED}
                  onPress={handleRegisterUser}
                  contentStyle={{paddingVertical: 10}}
                >
                  Sign up
                </Button>

                <View 
                  style={{display: 'flex', flexDirection: 'row', width: 320, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}
                >   
                  <Text style={{color: COLORS.GRAY, fontSize: 14, fontWeight: '600'}}>Already have an account ? </Text>
                  <TouchableOpacity
                    onPress={goToRegister}
                  >
                    <Text style={{color: COLORS.RED, fontSize: 14, fontWeight: '600'}}> Sign in</Text>
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

  