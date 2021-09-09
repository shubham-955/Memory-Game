import React, { Component } from 'react'
import { View, Text, FlatList, ToastAndroid, TouchableOpacity, StyleSheet } from 'react-native';

class App extends Component {

  state = {
    data: [],
    selectedItem1: null,
    selectedItem2: null,
    selectedId1: null,
    selectedId2: null,
    loading: false
  }

  GetData = () => {
    this.setState({ loading: true })
    fetch('https://jsonkeeper.com/b/D0G2', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        this.shufflearray(json)
        this.setState({ data: json })
        this.setState({ loading: false })
      })
  }

  swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  shufflearray(array) {
    let length = array.length;
    for (var i = length; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * i);
      const currentIndex = i - 1;
      this.swap(array, currentIndex, randomIndex)
    }
    return array;
  }

  componentDidMount() {
    this.GetData();
  }

  selectHandler1 = (id, type, name) => {
    let newArray = this.state.data.map((val, i) => {
      if (val.id === id) {
        return { ...val, isSelected: type }
      } else {
        return val
      }
    })
    this.setState({ data: newArray })
    let selectedItem1 = this.state.selectedItem1;
    let selectedId1 = this.state.selectedId1;
    console.log(selectedItem1, name);

    if (selectedItem1 == null && selectedId1 == null) {
      this.setState({
        selectedItem1: name,
        selectedId1: id
      })
    } else {
      this.setState({
        selectedItem2: name,
        selectedId2: id
      })
    }
    this.matchPair(name, id)
  }

  matchPair = (name, id) => {
    let selectedItem1 = this.state.selectedItem1;
    let selectedId1 = this.state.selectedId1;
    if (selectedItem1 != null && name != null) {
      if (selectedItem1 == name) {
        if (selectedId1 == id) {
          ToastAndroid.show("Can't select same item!", ToastAndroid.SHORT);
          let newArray3 = this.state.data;
          newArray3.forEach((value) => {
            return value.isSelected = false
          })
          this.setState({ data: newArray3, selectedItem1: null, selectedId1: null })
        } else {
          ToastAndroid.show("Pair matched!", ToastAndroid.SHORT);
          let newArray = this.state.data.filter((val) => {
            if (val.name !== name) {
              return val
            }
          })
          this.setState({ data: newArray, selectedItem1: null, selectedId1: null })
        }
      } else {
        ToastAndroid.show("Pair not matched!", ToastAndroid.SHORT);
        // console.log(this.state.data);
        let newArray2 = this.state.data;
        newArray2.forEach((value) => {
          return value.isSelected = false
        })
        this.setState({ data: newArray2, selectedItem1: null, selectedId1: null })
        // console.log(this.state.data)
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 50, backgroundColor: 'orange', elevation: 5, justifyContent: 'center' }}>
          <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', paddingLeft: 10 }}>MATCH THE FOLLOWING</Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={() => this.selectHandler1(item.id, !item.isSelected, item.name)}>
                <View style={{
                  ...styles.itemView,
                  backgroundColor: item.isSelected ? 'orange' : '#f2f2f2'
                }}>
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
            }
            onRefresh={() => this.GetData()}
            refreshing={this.state.loading}
            numColumns={4}
          />
        </View>
      </View>
    )
  }
}

export default App;

const styles = StyleSheet.create({
  itemView: {
    width: 70,
    height: 55,
    backgroundColor: "#f2f2f2",
    elevation: 5,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})