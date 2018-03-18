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

  _keyExtractor = (item) => item.name;

  _fetch = () => {
      fetch('https://secret-journey-80752.herokuapp.com/api/list')
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
        contentTitle: item.name,
        contentMainText: item.menu,
        contentCategory: item.tags,
        contentFrom: item.address,
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
                            <Icon name={'information-outline'} style={styles.articleIcon} size={35}/>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={styles.sourceText}>
                                {item.tags}
                            </Text>
                            <Text style={styles.boardText}>
                                {item.name}
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

  // _handleLearnMorePress = () => {
  //   WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  // };
  //
  // _handleHelpPress = () => {
  //   WebBrowser.openBrowserAsync(
  //     'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
  //   );
  // };
}

class DetailsScreen extends React.Component {

    render() {
        const { params } = this.props.navigation.state;

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
                    <View style={detailsStyles.main}>
                        <Text style={detailsStyles.mainText}>
                            {params.contentMainText}
                        </Text>
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
    supplement: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: 7
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
