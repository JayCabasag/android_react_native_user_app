import React from 'react'
import { Card,Text } from 'react-native-paper'
import { IMAGES } from '../utils/app_constants'

const CollectionList = ({data, handleGoToBookPreviewScreen}) => {

  return (
    <Card style={{height: 'auto', marginRight: 18, borderRadius: 15}} width={180} onPress={() => handleGoToBookPreviewScreen(data)}>
        <Card.Cover 
            source={{ uri: data?.book_cover ?? IMAGES.NO_IMAGE_AVAILABLE }}
            style={{height: 170, borderTopRightRadius: 15, borderTopLeftRadius: 15}}
        />
        <Card.Title 
            title={data?.title ?? 'No title...'}
            titleStyle={{
              fontSize: 14
            }}
            subtitle={data?.description ?? 'No description...'}
        />
    </Card>
  )
}

export default CollectionList