
import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Vide } from './Vide';
import  {Debit}  from './Debit';
import  {Temperature}  from './Temperature';



const renderScene = SceneMap({
  first: Vide,
  second: Debit,
  troisieme: Temperature,
});

export default function Main() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Vide' },
    { key: 'second', title: 'Debit' },
    { key: 'troisieme', title: 'Temperature' },
  ]);

  return (
    <TabView
    // swipeEnabled={false}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}