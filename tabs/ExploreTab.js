import React, {useContext, useState} from 'react'
import { View, StyleSheet, StatusBar, ScrollView, Image} from 'react-native'
import { Searchbar, Card, Text, ActivityIndicator, Appbar} from 'react-native-paper'
import { COLORS } from '../utils/app_constants'
import SearchBookList from '../components/SearchBookList'
import { useDebouncedCallback } from 'use-debounce';
import { collection, getDocs, setDoc, doc, limit, orderBy, query, where} from 'firebase/firestore/lite';
import { db } from '../firebase/firebaseConfig'
import { TOTAL_BOOK_LOAD_LIMIT } from '../utils/app_constants'
import { UserContext } from '../context/UserContext'
import axios from 'axios'

const ExploreTab = ({navigation}) => {
  const [user, setUser] = useContext(UserContext)
  const [searchQuery, setSearchQuery] = React.useState('')

  const debounceSearch = useDebouncedCallback((value) => {
    setSearchQuery(value)
  },1000)

  const onChangeSearch = (value) => {
    debounceSearch(value)
  }

  const [bookResultsList, setbookResultsList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [noResultsFound, setNoResultsFound] = useState(false)
  const [totalBookLoadLimit, setTotalBookLoadLimit] = useState(TOTAL_BOOK_LOAD_LIMIT)

  React.useEffect(() => {
    const getBooks = async () => {
      setIsLoading(true)
      const config = {
        headers:{
          'X-Algolia-API-Key': 'abe33f04785a63c7286f8f2d92400ea4',
          'X-Algolia-Application-Id': 'JXGVNF2YFE'
        }
      };
      const url = `https://JXGVNF2YFE-dsn.algolia.net/1/indexes/books?query=${searchQuery}&hitsPerPage=${totalBookLoadLimit}&getRankingInfo=1`;

      await axios.get(url, config)
      .then(res=>{
        setbookResultsList([...res.data.hits])
        setIsLoading(false)
      })
      .catch(err=> {
        console.log(err)
        setIsLoading(false)
      })

    }
    getBooks()
  }, [searchQuery, totalBookLoadLimit])

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  const handleGoToBookPreviewScreen = (data) => {
    navigation.navigate('BookPreview', {docId: data?.objectID ?? ''})
  }

  return (  
    <ScrollView 
    showsVerticalScrollIndicator={false}
    showsHorizontalScrollIndicator={false}
    style={styles.scrollView}
    onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        setTotalBookLoadLimit(prevState => {
          return prevState + TOTAL_BOOK_LOAD_LIMIT
        })
      }
    }}
    >
       <Appbar.Header
        style={{
          backgroundColor: COLORS.RED
        }}
        >
        <Appbar.Content title="Explore" />
      </Appbar.Header>
      <View style={{paddingHorizontal: 22, paddingVertical: 15}}>
        <Searchbar
          placeholder="Search..."
          onChangeText={onChangeSearch}
          inputStyle={{color: COLORS.BLACK}}
          defaultValue={searchQuery}
          cursorColor={COLORS.GRAY}
          iconColor={COLORS.GRAY}
          placeholderTextColor={COLORS.GRAY}
          selectionColor={COLORS.GRAY}
          style={{fontSize: 25, backgroundColor: '#f5f5f5', color: COLORS.GRAY, height: 65, borderRadius: 15, borderColor: COLORS.GRAY, borderWidth: 1}}
        />
      </View>
      <View style={{width: '100%', height: 'auto', minHeight: '100%', backgroundColor: 'transparent', height: 'auto', paddingHorizontal: 5}}>
        {
          !noResultsFound && bookResultsList?.map((data, index) => {
            return (<SearchBookList key={index} data={data} handleGoToBookPreviewScreen={handleGoToBookPreviewScreen}/>)
          })
        }
        {
          isLoading && (<ActivityIndicator animating={true} color={COLORS.RED} style={{height: 180}} />)
        }
        {
           !isLoading && noResultsFound && (<Text style={{color: COLORS.RED, flex: 1, textAlign: 'center'}}>No results found for "{searchQuery}"</Text>)
        }
      </View>
    </ScrollView>
  )
}

export default ExploreTab

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.WHITE
  },
  newCollectionText: {
    color: COLORS.WHITE,
    fontSize: 22,
    padding: 22,
    fontWeight: 'bold'
  },
  headerText: {
    fontSize: 30,
    color: COLORS.WHITE,
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bolder',
    marginTop: StatusBar.currentHeight
  }
})