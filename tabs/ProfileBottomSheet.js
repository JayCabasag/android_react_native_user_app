import { BottomSheet } from 'react-native-btr';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Appbar, Button, TextInput} from 'react-native-paper';
import { COLORS } from '../utils/app_constants';
import React from 'react';
// import { UserContext } from '../context/userContext';

const ProfileBottomSheet = ({navigation, showModal, handleToggleModal}) => {

  // const { user, login, logout } = useContext(UserContext);

  // console.log(user)

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
                <View style={{ flex: 1, flexDirection: 'column', height: 'auto'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>Edit Profile</Text>
                <TextInput
                    mode="outlined"
                    label="Fullname"
                    right={<TextInput.Affix text="/100" />}
                    style={{marginTop: 20}}
                    activeOutlineColor={COLORS.RED}
                />
                 <TextInput
                    mode="outlined"
                    label="Email"
                    right={<TextInput.Affix text="/100" />}
                    style={{marginTop: 5}}
                    activeOutlineColor={COLORS.RED}
                />
                 <TextInput
                    mode="outlined"
                    label="Password"
                    right={<TextInput.Affix text="/100" />}
                    style={{marginTop: 5}}
                    activeOutlineColor={COLORS.RED}
                />
                <View style={{marginVertical: 30}}>
                    <Button onPress={() => login(123, 'jay@gmail.com', 'password', 'student')} icon="logout" mode="contained" style={{marginTop: 15, padding: 7, backgroundColor: COLORS.RED}}>
                        Save
                    </Button>
                    <Button mode="outlined" activeOutlineColor={COLORS.RED} style={{marginTop: 15, padding: 7, backgroundColor: COLORS.WHITE}} onPress={handleToggleModal}>
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
  