import React, {useState} from 'react';

import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Dimensions, Pressable, Text, useColorScheme, View, Animated, Alert} from 'react-native';
import regression from '../helpers/regression';
import {CheckBox, Input, Button, Slider, Icon, Tooltip, ButtonGroup, Divider, Overlay} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
import PDFView from 'react-native-view-pdf';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export const Debit = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [checked, toggleChecked] = useState(true);
  const [placeholder, setPlaceholder] = useState('Saisir tension');
  const [value, setValue] = useState(1);
  const [valueString, setValueString] = useState('');
  //   const [debit, setDebit] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedIndexCapteur, setIndexCapteur] = useState(1);
  const [selectedIndexGaz, setIndexGaz] = useState(1);
  const [selectedIndexType, setIndexType] = useState(0);
  const [coefPerso, setCoefPerso] = useState(1);
  const typeGaz = ['H2-1.01', 'Argon-1.4', 'Air-1', 'H2 FIC-1.19', 'coef perso = ' + coefPerso];
  const coefTypeGaz = [1.01, 1.4, 1.0, 1.19, coefPerso];
  const type = ['L/min', 'kg/h'];

  let dataDEB003_100 = [
    [0.52, 9.8477, 0.574],
    [1.027, 19.5239, 0.568],
    [2.017, 38.1004, 0.564],
    [3.01, 57.545, 0.56],
    [4.027, 77.6608, 0.564],
    [4.907, 96.5019, 0.64],
  ];
  let dataDEB003_30 = [
    [0.448, 3.0341, 0.3],
    [0.994, 6.3617, 0.257],
    [1.999, 12.0553, 0.553],
    [3.047, 17.797, 0.555],
    [4.073, 23.4518, 0.55],
    [4.969, 28.6705, 0.566],
  ];
  let dataDEB003_300 = [
    [0.509, 26.95813, 0.562],
    [1.0057, 54.50487, 0.571],
    [1.998, 110.5131, 0.491],
    [2.9853, 172.3644, 0.463],
    [4.0273, 240.84813, 0.456],
    [4.9953, 303.55744, 0.681],
  ];

  let deb003_30_Incertitude = [];
  let deb003_100_Incertitude = [];
  let deb003_300_Incertitude = [];
  for (const iterator of dataDEB003_30) {
    deb003_30_Incertitude.push([iterator[0], iterator[2]]);
  }
  for (const iterator of dataDEB003_100) {
    deb003_100_Incertitude.push([iterator[0], iterator[2]]);
  }
  for (const iterator of dataDEB003_300) {
    deb003_300_Incertitude.push([iterator[0], iterator[2]]);
  }
  const dataIncertitude = [deb003_30_Incertitude, deb003_100_Incertitude, deb003_300_Incertitude];

  const capteurs = ['DEB003-30', 'DEB003-100', 'DEB003-300'];
  const dataCapteurs = [dataDEB003_30, dataDEB003_100, dataDEB003_300];
  console.log('data', selectedIndexCapteur);
  const result = regression.polynomial(dataCapteurs[selectedIndexCapteur], {
    order: 4,
    precision: 12,
  });
  const resultIncertitude = regression.polynomial(dataIncertitude[selectedIndexCapteur], {
    order: 4,
    precision: 12,
  });
  const updateIndexCapteur = index => {
    setIndexCapteur(index);
  };
  const updateIndexGaz = index => {
    console.log('index', index);
    if (index == 4) {
      console.log('perso selectionner');
      toggleOverlay();
      // Alert.alert("")
    }
    setIndexGaz(index);
  };

  const [visible, setVisible] = useState(false);

  const toggleOverlayRapport = () => {
    setVisible(!visible);
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };
  const updateIndexType = index => {
    console.log('updateIndexType');
    console.log('index');
    console.log(index);
    setIndexType(index);
  };
  const dataEtalonnage = [
    ['FR200817078', '20/02/2020'],
    ['FR200817072', '20/02/2020'],
    ['FR200817080', '20/02/2020'],
  ];
  console.log('value');
  console.log(value);
  console.log(coefTypeGaz[selectedIndexGaz]);
  const debit = Math.round(result.predict(value)[1] * coefTypeGaz[selectedIndexGaz] * 100) / 100;
  //   const debit= result.predict(value)
  const debitIncertitude = resultIncertitude.predict(value)[1];

  console.log('parsedebit', parseFloat(debit));
  console.log('debitisnan', !isNaN(parseFloat(debit)));
  console.log('debit = ', debit);
  console.log('debit = ', result.predict(value)[1]);

  const handleInput = input => {
    // setValue
    console.log('hnadleinput');
    // console.log(input);
    // console.log(typeof input);

    setValue(input);
    setValueString(input.toString());
  };
  const raz = () => {
    setValueString('');
    setValue(0);
  };
  return (
    <>
      <View style={{flex: 1}}>
        <View style={{flex: 2, margin: 10}}>
          <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay} overlayStyle={{height: '20%', width: '60%', borderRadius: 30}}>
            <Text
              style={{
                flex: 1,
                fontSize: 25,
                alignSelf: 'flex-start',
                alignContent: 'center',
                padding: '5%',
              }}>
              Coef perso :
            </Text>
            <Input
              containerStyle={{flex: 2, justifyContent: 'center'}}
              style={{fontSize: 20}}
              placeholder="Saisir votre valeur"
              onChangeText={value => setCoefPerso(value)}
              // value={valueString}
              autoFocus
              onBlur={toggleOverlay}
              keyboardType="number-pad"
            />
          </Overlay>
          <ButtonGroup onPress={updateIndexCapteur} selectedIndex={selectedIndexCapteur} buttons={capteurs} containerStyle={{height: 40}} />
          <ButtonGroup onPress={updateIndexGaz} selectedIndex={selectedIndexGaz} buttons={typeGaz} containerStyle={{height: 40}} />
          {/* <ButtonGroup
              onPress={updateIndexType}
              selectedIndex={selectedIndexType}
              buttons={type}
              containerStyle={{height: 40}}
            /> */}
          <Divider style={{backgroundColor: 'blue', marginVertical: 10}} />
        </View>
        <View>
          <Overlay isVisible={visible} onBackdropPress={toggleOverlayRapport}>
            <PDFView
              style={{
                width: windowWidth * 0.85,
                height: windowHeight * 0.85,
              }}
              onError={error => console.log('onError', error)}
              onLoad={() => console.log('PDF rendered from url')}
              // resource="http://www.pdf995.com/samples/pdf.pdf"
              resource={`https://lomano.go.yo.fr/rapport_trescal/${capteurs[selectedIndexCapteur]}.pdf`}
              resourceType="url"
            />
          </Overlay>
        </View>
        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
          <Pressable style={{flexDirection: 'row'}} onPress={toggleOverlayRapport}>
            <Icon
              // raised
              name="file-alt"
              type="font-awesome-5"
              color="#000"
            />
            <Text
              style={{
                marginHorizontal: 20,
                fontSize: 20,
                alignSelf: 'center',
              }}>{`${dataEtalonnage[selectedIndexCapteur][0]} du ${dataEtalonnage[selectedIndexCapteur][1]}`}</Text>
          </Pressable>
          <Divider
            style={{
              backgroundColor: 'blue',
              marginVertical: 10,
              width: 100,
            }}
          />
          <Text
            style={{
              fontSize: 50,
              alignSelf: 'auto',
              //   marginTop:20
            }}>{`${Math.round(debit * 1000) / 1000} ${type[selectedIndexType]}`}</Text>

          {/* <Tooltip
            height={100}
            backgroundColor={'lightblue'}
            overlayColor="rgba(250, 250, 250, 0.90)"
            popover={
              <View>
                <Text>Cette valeur est évaluée gràce à une modélisation polynomiale de degré 4 .</Text>
              </View>
            }> */}
            <Text
              style={{
                fontSize: 40,
                alignSelf: 'auto',
              }}>{`Ie = ${Number.parseFloat(debitIncertitude).toFixed(2)} %`}</Text>
          {/* </Tooltip> */}
          <Divider
            style={{
              backgroundColor: 'blue',
              marginVertical: 10,
              width: 100,
            }}
          />
          <Text
            style={{
              fontSize: 30,
              marginTop: 20,
            }}>
            {`${Math.round(value * 1000) / 1000} V`}
          </Text>
        </View>
        <View style={{flex: 2, marginTop: 50, margin: 10}}>
          <Divider style={{backgroundColor: 'blue', marginVertical: 10}} />
          <View
            style={{
              flexDirection: 'row',
              flex: 3,
              margin: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Input
              containerStyle={{flex: 3}}
              style={{fontSize: 25, marginLeft: 10}}
              placeholder="Saisir Tension"
              leftIcon={{type: 'font-awesome', name: 'tachometer', size: 40}}
              onChangeText={value => handleInput(value)}
              value={valueString}
              errorStyle={{color: 'red'}}
              errorMessage={value != 0 && (value > dataCapteurs[selectedIndexCapteur][5][0] || value < dataCapteurs[selectedIndexCapteur][0][0]) ? "VALEUR EN DEHORS DE LA PLAGE D'ETALONNAGE" : null}
              keyboardType="number-pad"
            />
            <Button
              // style={{flex:2,fontSize:40}}
              containerStyle={{
                flex: 1,
                alignItems: 'center',
                height: 50,
                // backgroundColor:"grey",
                justifyContent: 'center',
                paddingBottom: 5,
              }}
              title="RAZ"
              onPress={raz}
            />
          </View>

          <View
            style={{
              flex: 1,
              alignItems: 'stretch',
              justifyContent: 'center',
              marginHorizontal: 40,
              marginVertical: 20,
              marginTop: 10,
            }}>
            <Slider value={isNaN(value) ? 2.5 : value} thumbStyle={{height: 30, width: 20, backgroundColor: '#4287f5'}} onValueChange={value1 => setValue(value1)} maximumValue={dataCapteurs[selectedIndexCapteur][5][0]} minimumValue={dataCapteurs[selectedIndexCapteur][0][0]} step={0.001} />
          </View>
        </View>
      </View>
    </>
  );
};
