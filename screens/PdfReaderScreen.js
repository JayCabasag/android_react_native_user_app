import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Appbar } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { COLORS } from '../utils/app_constants';
import { ActivityIndicator } from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PdfReaderScreen = ({ navigation, route: {params :{ file }} }) => {

  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleOnLoad = (data) => {
    setIsLoadingPdf(false)
  }
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        style={{
          backgroundColor: COLORS.RED,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} size={23} />
        <Appbar.Content title={'Pdf viewer'} />
      </Appbar.Header>
      {isLoadingPdf && (
        <View
          style={{
            height: windowHeight,
            width: windowWidth,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size={30} animating={true} color={COLORS.RED} style={{ height: 'auto', marginBottom: 15 }} />
          <Text>Loading pdf file... please wait</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri:
            file,
          }}
          onLoad={(data) => handleOnLoad(data)}
          onError={(error) => setIsError(true)}
          style={{ flex: 1 }}
        />
        {
          isError && (<Text>An error occured</Text>)
        }
      </View>
    </View>
  );
};

export default PdfReaderScreen   