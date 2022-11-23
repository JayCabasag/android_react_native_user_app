import React from 'react'
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View, Image, Dimensions} from 'react-native'
import { StyleSheet} from 'react-native';
import { Button } from 'react-native-paper';
import { ScrollView } from 'react-native-safe-area-context';
import { COLORS} from '../utils/app_constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function PdfReaderScreen({navigation,route}) {
   const fileToPreview = route.params.file ?? ''

   return (
    <SafeAreaView style={{height: '100%'}}>
        <ScrollView
            style={styles.scrollView}
        >
            <View style={styles.container}>
            <Text>{fileToPreview}</Text>
            <Button
              onPress={() => navigation.navigate('Home')}
            >
                Return Home
            </Button>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    scrollView: {
        height: '100%',
        width: '100%'
    },
    container: {
      paddingTop: StatusBar.currentHeight,
      backgroundColor: COLORS.WHITE,
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: windowHeight,
      width: windowWidth,
      display: 'flex'
    },
});
  