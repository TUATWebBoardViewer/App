import React from 'react';
import {
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {StackNavigator} from "react-navigation";
import HyperLink from 'react-native-hyperlink';
import { WebBrowser } from "expo";


export default class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'タイムライン',
    };

  constructor(props) {
    super(props);
    this.state = {
        data: null,
        refreshing: false,
        isModalVisible: false,
        modalContentData: null,
    }
  }

  componentWillMount() {
      this._fetch();
  }

  _keyExtractor = (item) => item.num;

  _fetch = () => {
      fetch('https://1f3fdb20.ngrok.io/api/list')
          .then((resp) => resp.json())
          .then((respJson) => {
              this.setState({
                  data: respJson,
                  refreshing: false,
              })
          })
          .catch((err) => {
              console.error(err)
          })
  };

  _onRefresh = () => {
      this.setState({refreshing: true});
      this._fetch();
  };

  _showDetails = (item) => {
    this.props.navigation.navigate('Details', {
        contentTitle: item.title,
        contentMainText: item.body,
        contentCategory: item.category,
        contentFrom: item.publisher,
        contentAttachTitle: item.attach_name,
        contentAttachURL: item.attach_url,
    });
  };

  render() {
      return (
        <View style={{flex: 1}}>
            <FlatList
                style={styles.body}
                data={this.state.data}
                extraData={this.state.data}
                keyExtractor={this._keyExtractor}
                renderItem={({item}) =>
                    <TouchableOpacity style={styles.boardView} onPress={() => this._showDetails(item)}>
                        <View style={{justifyContent: 'center'}}>
                            <Icon name={item.important === 1 ? 'alert' : 'information-outline'} style={styles.articleIcon} size={35}/>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={styles.sourceText}>
                                {item.publisher}
                            </Text>
                            <Text style={styles.boardText}>
                                {item.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                }
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
            />
        </View>
      )
  }

}

class DetailsScreen extends React.Component {

  _handleMainBodyURLPress = (url) => {
      WebBrowser.openBrowserAsync(url);
  };

  _keyExtractor = (item) => item[0];

  _openAttachURLs = (item) => {
      WebBrowser.openBrowserAsync(item.contentAttachURL);
  };

    render() {
        const { params } = this.props.navigation.state;
        // 添付ファイルだけを取得するエンドポイントを持っておいた方が良い
        const titles = JSON.parse(params.contentAttachTitle.replace(/'/g, '"'));

        return (
            <ScrollView style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <View style={detailsStyles.title}>
                        <Text style={detailsStyles.titleText}>
                            {params.contentTitle}
                        </Text>
                    </View>
                    <View style={detailsStyles.supplement}>
                        <Icon name={'information-outline'} style={detailsStyles.icon} size={45}/>
                        <View style={detailsStyles.sender}>
                            <Text style={detailsStyles.categoryText}>
                                {params.contentCategory}
                            </Text>
                            <Text style={detailsStyles.fromText}>
                                {params.contentFrom}
                            </Text>
                        </View>
                    </View>
                    <View style={detailsStyles.attachment}>
                        <FlatList
                            style={{flex: 1}}
                            data={titles}
                            extraData={titles}
                            keyExtractor={this._keyExtractor}
                            renderItem={({item}) =>
                                <TouchableOpacity style={detailsStyles.attachmentView}>
                                    <View style={{justifyContent: 'center'}}>
                                       <Icon name={'attachment'} size={40} style={{justifyContent: 'center', paddingHorizontal: 10}}/>
                                    </View>
                                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                                        <Text size={35}>
                                            {item}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                    <View style={detailsStyles.main}>
                        <HyperLink linkStyle={detailsStyles.mainTextURL} onPress={ (url, _) => this._handleMainBodyURLPress(url)}>
                            <Text style={detailsStyles.mainText}>
                                {params.contentMainText}
                            </Text>
                        </HyperLink>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export const HomeStack = StackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        Details: {
            screen: DetailsScreen,
        },
    },
    {
        initialRouteName: 'Home',
    },
);

const detailsStyles = StyleSheet.create({
    title: {
        flex: 1,
        padding: 15,
    },
    titleText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    main: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    mainText: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainTextURL: {
        color: '#2980b9',
        fontSize: 15,
    },
    supplement: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: 7
    },
    attachment: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: 7
    },
    attachmentView: {
        flex: 1,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    icon: {
        paddingHorizontal: 15,
        paddingTop: 5,
        justifyContent: 'center',
    },
    sender: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    categoryText: {
        fontSize: 17,
        color: '#0078ff',
    },
    fromText: {
        paddingVertical: 5,
        fontSize: 15,
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        flex: 1,
        backgroundColor: '#fff',
    },
    boardView: {
        flex: 1,
        padding: 15,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    boardText: {
        fontSize: 16,
        lineHeight: 25,
    },
    sourceText: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: 0,
        color: '#0078ff',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalMainContentText: {

    },
    modalCloseButton: {
        backgroundColor: 'white',
        borderColor: '#333',
        borderWidth: 2,
        borderRadius: 22,
    },
    modalCloseButtonText: {
        fontSize: 14,
        width: 200,
        fontWeight: '500',
        color: '#333',
    },
    articleIcon: {
        paddingRight: 10,
        justifyContent: 'center'
    },
    }
);
