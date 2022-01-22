import React, {useState, useEffect} from 'react';
import VerticalSlider from 'rn-vertical-slider';
import {View, Dimensions, Pressable, Alert} from 'react-native';
import regression from '../helpers/regression';
import {transformerVideToLog, fetchDataEtalon} from '../helpers/functionVide';
import {interpoler} from '../helpers/functionUtilitaire';
import {Card, Input, Button, Overlay, Slider, ButtonGroup, Divider, Tooltip, Icon, Text} from 'react-native-elements';
import PDFView from 'react-native-view-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export const Vide = () => {
  const [value, setValue] = useState(-4);
  const [vide, setVide] = useState(null);
  const [wait, setWait] = useState(false);
  const [dataComplete, setDataComplete] = useState(null);
  const [modelisation, setModelisation] = useState(null);
  const [dataIncertitude, setDataIncertitude] = useState(null);
  const [valueString, setValueString] = useState('');
  const [selectedIndexCapteur, setIndexCapteur] = useState(0);
  const [visible, setVisible] = useState(false);
  const [SEC02C, setSEC02C] = useState(null);
  const [PRIM03, setPRIM03] = useState(null);
  useEffect(() => {
    getData('dataLog').then(e => {
      if (e) {
        console.log('Ya des enregistrùeent!!!');
        setDataComplete(JSON.parse(e));
      } else {
        console.log("Pas d'enregistrement!!");
        // getData('SEC02C').then(e => setSEC02C(JSON.parse(e)));
        // getData('PRIM03').then(e => setPRIM03(JSON.parse(e)));
      }
    });
  }, []);

  useEffect(() => {
    if (dataComplete) {
      // console.log('dataComplete');
      // console.log(dataComplete);
      // console.log(dataComplete.data[0]);
      // console.log(dataComplete.data[1]);
      const resultSEC02C = regression.polynomial(dataComplete.data[0], {
        order: 4,
        precision: 12,
      });

      const resultPRIM03 = regression.polynomial(dataComplete.data[1], {
        order: 4,
        precision: 12,
      });

      if (isNaN(resultSEC02C.equation[0])) fetchData();
      else {
        setModelisation({
          resultSEC02C,
          resultPRIM03,
        });
      }
    }
  }, [dataComplete]);
  useEffect(() => {
    if (dataComplete) setValue((dataComplete.data[selectedIndexCapteur][0][0] + dataComplete.data[selectedIndexCapteur][dataComplete.data[selectedIndexCapteur].length - 1][0]) / 2);
  }, [selectedIndexCapteur]);

  useEffect(() => {
    if (modelisation) {
      if (selectedIndexCapteur == 0) {
        const correctionSec02c = modelisation.resultSEC02C.predict(value)[1];
        // const IncertitudeSEC02C = modelisation.resultIncertitudeSEC02C.predict(value)[1];
        setVide(correctionSec02c);
        setDataIncertitude(interpoler(value, dataComplete.dataIncertitude[0]));
        // setDataIncertitude(IncertitudeSEC02C)
      } else if (selectedIndexCapteur == 1) {
        const correctionPRIM03 = modelisation.resultPRIM03.predict(value)[1];
        // const IncertitudePRIM03 = modelisation.resultIncertitudePRIM03.predict(value)[1];
        setVide(correctionPRIM03);
        setDataIncertitude(interpoler(value, dataComplete.dataIncertitude[1]));
      }
    }
  }, [value]);

  useEffect(() => {
    if (SEC02C && PRIM03) {
      ///// manipulation des données des etalons pour les transformer en LOG10
      let SEC02CLog = transformerVideToLog(SEC02C);
      let PRIM03Log = transformerVideToLog(PRIM03);

      let SEC02CIncertitude = [];
      for (const iterator of SEC02C.data) {
        SEC02CIncertitude.push([iterator[0], iterator[2]]);
      }
      ////
      let PRIM03Incertitude = [];
      for (const iterator of PRIM03.data) {
        PRIM03Incertitude.push([iterator[0], iterator[2]]);
      }
      const SEC02Cinfo = {numFR: SEC02C.numFR, date: SEC02C.date};
      const PRIM03info = {numFR: PRIM03.numFR, date: PRIM03.date};
      const dataIncertitude = [SEC02CIncertitude, PRIM03Incertitude];
      const data = [SEC02CLog, PRIM03Log];
      const info = [SEC02Cinfo, PRIM03info];
      storeData('dataLog', JSON.stringify({data, dataIncertitude, info}));
    }
  }, [SEC02C, PRIM03]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const fetchData = () => {
    // setWait(true);
    fetchDataEtalon().then(data => {
      if (data) {
        setSEC02C(data[0]);
        setPRIM03(data[1]);
        // setWait(false);

        Alert.alert('ca a marché');
      } else {
        // setWait(false);
        Alert.alert('faut recommencer !');
      }
    });
  };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  const getData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue;
      // return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };
  const capteurs = ['SEC02C', 'PRIM03'];

  const updateIndexCapteur = index => {
    setIndexCapteur(index);
  };
  const updateIndexGaz = index => {
    setIndexGaz(index);
  };
  const updateIndexType = index => {
    console.log('index');
    console.log(index);
    setIndexType(index);
  };

  const handleInput = input => {
    console.log(input);
    // setValue(Math.log10(input));
    setValueString(input.toString());
  };
  const raz = () => {
    setValueString('');
    setValue(0);
  };
  // if (wait) {
  //   return <ActivityIndicator />
  // }

  if (modelisation) {
    return (
      <>
        <View style={{flex: 1}}>
          <Divider style={{backgroundColor: 'blue'}} />
          <ButtonGroup onPress={updateIndexCapteur} selectedIndex={selectedIndexCapteur} buttons={capteurs} containerStyle={{height: 50, marginVertical: 20}} />
          <Divider style={{backgroundColor: 'blue'}} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 9,
                //   flexDirection:"row",
                justifyContent: 'center',
                padding: 10,
                margin: 10,
                alignItems: 'center',
                // backgroundColor:"lightgrey"
              }}>
              <View>
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                  <PDFView
                    style={{
                      width: windowWidth * 0.85,
                      height: windowHeight * 0.85,
                    }}
                    onError={error => console.log('onError', error)}
                    onLoad={() => console.log('PDF rendered from url')}
                    resource={`https://lomano.fr/trescal_slc/rapport_trescal/${capteurs[selectedIndexCapteur]}.pdf`}
                    resourceType="url"
                  />
                </Overlay>
              </View>

              <View
                style={{
                  flex: 10,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Pressable style={{flexDirection: 'row'}} onPress={toggleOverlay}>
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
                    }}>
                    {`${dataComplete.info[selectedIndexCapteur].numFR} du ${new Date(dataComplete.info[selectedIndexCapteur].date).toLocaleDateString('FR-fr')}`}
                  </Text>
                </Pressable>
                <Divider
                  style={{
                    backgroundColor: 'blue',
                    marginVertical: 10,
                    width: 100,
                  }}
                />
                <Tooltip
                  height={100}
                  backgroundColor={'lightblue'}
                  overlayColor="rgba(250, 250, 250, 0.90)"
                  popover={
                    <View>
                      <Text>Cette valeur est évaluée gràce à une modélisation polynomiale de degré 4 .</Text>
                    </View>
                  }>
                  <Text
                    //  h2
                    style={{
                      fontSize: 50,
                      alignSelf: 'auto',
                    }}>
                    {`${Math.pow(10, vide).toExponential(2)} mbar`}
                  </Text>
                </Tooltip>
                {/* {console.log(regression)} */}
                <Tooltip
                  height={150}
                  backgroundColor={'lightblue'}
                  overlayColor="rgba(250, 250, 250, 0.90)"
                  popover={
                    <View>
                      <Text>Cette valeur d'incertitude est évaluée gràce à une interpolation linéaire entre chaque points du CE.</Text>
                    </View>
                  }>
                  <Text
                    style={{
                      fontSize: 40,
                      alignSelf: 'auto',
                    }}>
                    {`Ie = ${Number.parseFloat(dataIncertitude).toFixed(1)} %`}
                  </Text>
                </Tooltip>
                <Divider
                  style={{
                    backgroundColor: 'blue',
                    marginVertical: 10,
                    width: 100,
                  }}
                />
                <Button title="Télécharger données" onPress={fetchData} />
                <Tooltip
                  height={150}
                  backgroundColor={'lightblue'}
                  overlayColor="rgba(250, 250, 250, 0.90)"
                  popover={
                    <View>
                      <Text>Il s'agit de la valeur sans correction lue sur l'étalon.</Text>
                    </View>
                  }>
                  <Text
                    style={{
                      fontSize: 40,
                    }}>
                    {`Lue : ${Number.parseFloat(Math.pow(10, value)).toExponential(2)} mbar`}
                    {/* {`Tension : ${Math.round(value * 1000) / 1000} V`} */}
                  </Text>
                </Tooltip>
              </View>
              <View style={{flex: 1, width: '100%', padding: 10}}>
                <View style={{flexDirection: 'row', height: '100%'}}>
                  <Input
                    containerStyle={{flex: 3}}
                    style={{fontSize: 25, marginLeft: 10}}
                    placeholder="Saisir Tension"
                    leftIcon={{
                      type: 'font-awesome',
                      name: 'tachometer',
                      size: 40,
                    }}
                    onChangeText={value => handleInput(value)}
                    value={valueString}
                    onSubmitEditing={() => setValue(Math.log10(Number(valueString)))}
                    errorStyle={{color: 'red'}}
                    errorMessage={(value != 0 && value < dataComplete.data[selectedIndexCapteur][0][0]) || value > dataComplete.data[selectedIndexCapteur][dataComplete.data[selectedIndexCapteur].length - 1][0] ? "VALEUR EN DEHORS DE LA PLAGE D'ETALONNAGE" : null}
                    keyboardType="number-pad"
                  />

                  <Button
                    containerStyle={{
                      flex: 1,
                      alignItems: 'center',
                      height: 50,
                      justifyContent: 'center',
                      paddingBottom: 5,
                    }}
                    title="RAZ"
                    onPress={raz}
                  />
                </View>
                {/* <Divider style={{backgroundColor: 'blue', marginVertical: 10}} /> */}
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: 10,
              }}>
              <VerticalSlider
                value={value}
                disabled={false}
                // min={1e-4}
                // max={1}
                min={dataComplete.data[selectedIndexCapteur][0][0]}
                max={dataComplete.data[selectedIndexCapteur][dataComplete.data[selectedIndexCapteur].length - 1][0]}
                onChange={value1 => setValue(value1)}
                onComplete={value => {
                  console.log('COMPLETE', value);
                }}
                width={50}
                height={windowHeight * 0.85}
                step={0.001}
                borderRadius={10}
                minimumTrackTintColor={'#2f4a87'}
                //   minimumTrackTintColor={'tomato'}
                maximumTrackTintColor={'lightgrey'}
                // showBallIndicator
                // ballIndicatorColor={'#1a3063'}
                // ballIndicatorHeight={50}
                // ballIndicatorWidth={5}
                // ballIndicatorPosition={0}
                // ballIndicatorTextColor={'white'}
                // renderIndicator
                //     shadowProps={       shadowOffsetWidth = 0,
                //       shadowOffsetHeight = 1,
                //       shadowOpacity = 0.22,
                //       shadowRadius = 2.22,
                //       elevation = 3,
                //       shadowColor = '#000'
                //  }
              />
            </View>
          </View>
        </View>
      </>
    );
  } else
    return (
      <View>
        <Text>nada</Text>
        <Button title="fetch" onPress={fetchData} />
      </View>
    );
};
