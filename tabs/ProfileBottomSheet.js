import { BottomSheet } from 'react-native-btr';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Appbar, Button, TextInput, Avatar} from 'react-native-paper';
import { COLORS, IMAGES } from '../utils/app_constants';
import React, {useState} from 'react';

const ProfileBottomSheet = ({navigation, showModal, handleToggleModal}) => {

  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [profile, setProfile] = useState(IMAGES.LOGIN_BANNER_IMAGE)
  
   return (
    <BottomSheet
          visible={showModal}
          onBackButtonPress={handleToggleModal}
          onBackdropPress={handleToggleModal}
        >
          <View style={styles.bottomNavigationView}>
            <Text
                style={{
                  textAlign: 'center',
                  padding: 20,
                  fontSize: 22,
                }}>
                Account settings
              </Text>
              
              <ScrollView style={{width: '100%', paddingHorizontal: 22}} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, flexDirection: 'column', height: 'auto', display: 'flex'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Edit Profile</Text>
                  
                 <Avatar.Image size={150} source={{uri: profile}} style={{alignSelf: 'center', marginVertical: 10}}/>
                 <Button mode='contained' color={COLORS.RED} icon={'upload'}>Upload Photo</Button>
                 
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
                  label={'New password'}
                  value={newPassword}
                  onChangeText={text => setNewPassword(text)}
                  style={styles.inputField}
                  selectionColor={COLORS.RED}
                  outlineColor={COLORS.RED}
                  underlineColor={COLORS.RED}
                  placeholderTextColor={COLORS.RED}
                  activeOutlineColor={COLORS.RED}
                />
                <View style={{marginVertical: 30}}>
                    <Button onPress={() => login(123, 'jay@gmail.com', 'password', 'student')} icon="logout" mode="contained" contentStyle={{padding: 5}} style={{marginTop: 15, backgroundColor: COLORS.RED}}>
                        Save
                    </Button>
                    <Button mode="outlined" color={COLORS.RED} activeOutlineColor={COLORS.RED} style={{marginTop: 15, backgroundColor: COLORS.WHITE}} contentStyle={{padding: 5}} onPress={handleToggleModal}>
                        <Text style={{color: COLORS.RED}}>CANCEL</Text>
                    </Button>
                </View>
                </View>
              </ScrollView>
          </View>
        </BottomSheet>
  )
}

export default ProfileBottomSheet

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E0F7FA',
    },
    bottomNavigationView: {
      backgroundColor: COLORS.WHITE,
      width: '100%',
      height: '70%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  