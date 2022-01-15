import React, {useState, useEffect} from 'react';
import VerticalSlider from 'rn-vertical-slider';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  FlatList,
  // Text,
  useColorScheme,
  View,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import regression from '../helpers/regression';
import {
  Card,
  Input,
  Button,
  Overlay,
  Slider,
  ButtonGroup,
  Divider,
  Tooltip,
  Icon,
  Text,
} from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
import PDFView from 'react-native-view-pdf';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export const Vide = () => {
  const [value, setValue] = useState(-4);
  const [vide, setVide] = useState(null);
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
      console.log('dataComplete');
      console.log(dataComplete);
      const resultSEC02C = regression.polynomial(dataComplete.data[0], {
        order: 4,
        precision: 12,
      });
      const resultIncertitudeSEC02C = regression.polynomial(
        dataComplete.dataIncertitude[selectedIndexCapteur],
        {
          order: 4,
          precision: 12,
        },
      );
      const resultPRIM03 = regression.polynomial(dataComplete.data[1], {
        order: 4,
        precision: 12,
      });
      const resultIncertitudePRIM03 = regression.polynomial(
        dataComplete.dataIncertitude[1],
        {
          order: 4,
          precision: 12,
        },
      );

      setModelisation({
        resultSEC02C,
        resultIncertitudeSEC02C,
        resultPRIM03,
        resultIncertitudePRIM03,
      });
      // setVide(result.predict(value)[1]);
      // setIncertitude(resultIncertitude.predict(value)[1]);
    }
  }, [dataComplete]);

  useEffect(() => {
    if (modelisation) {
      console.log("VALUE")
      console.log(value)
      console.log(Math.log10(value))
      if (selectedIndexCapteur == 0) {
        const correctionSec02c=modelisation.resultSEC02C.predict(Math.log10(value))[1]
        console.log("correctionSec02c")
        console.log(correctionSec02c)
        setVide(correctionSec02c)
      }
     else if (selectedIndexCapteur == 1) {
       const correctionPRIM03=modelisation.resultPRIM03.predict(Math.log10(value))[1]
       console.log("PRIM03")
       console.log(correctionPRIM03)
        setVide(correctionPRIM03)
      }
    }
  }, [value]);
  useEffect(() => {
    if (SEC02C && PRIM03) {
      console.log('lsdknflksdnfsldknf');
      console.log('lsdknflksdnfsldknf');
      console.log('lsdknflksdnfsldknf');
      console.log('lsdknflksdnfsldknf');
      console.log('lsdknflksdnfsldknf');
      console.log('lsdknflksdnfsldknf');
      console.log('lsdknflksdnfsldknf');
      console.log('lsdknflksdnfsldknf');
      console.log('lsdknflksdnfsldknf');
      let SEC02CLog = [...SEC02C.data];
      let tempSec02cLog = [];
      let tempSec02cLog2 = [];
      for (const iterator of SEC02CLog) {
        let temp = Math.log10(iterator[1]);
        let temp2 = Math.log10(iterator[0]);
        tempSec02cLog.push(temp);
        tempSec02cLog2.push(temp2);
      }
      for (let i = 0; i < tempSec02cLog.length; i++) {
        SEC02CLog[i][1] = tempSec02cLog[i];
        SEC02CLog[i][0] = tempSec02cLog2[i];
      }
      let PRIM03Log = [...PRIM03.data];
      let tempPRIM03Log = [];
      let tempPRIM03Log2 = [];
      for (const iterator of PRIM03Log) {
        let temp = Math.log10(iterator[1]);
        let temp2 = Math.log10(iterator[0]);
        tempPRIM03Log.push(temp);
        tempPRIM03Log2.push(temp2);
      }
      for (let i = 0; i < tempPRIM03Log.length; i++) {
        PRIM03Log[i][1] = tempPRIM03Log[i];
        PRIM03Log[i][0] = tempPRIM03Log2[i];
      }

      let SEC02CIncertitude = [];
      for (const iterator of SEC02C.data) {
        SEC02CIncertitude.push([iterator[0], iterator[2]]);
      }
      let PRIM03Incertitude = [];
      for (const iterator of PRIM03.data) {
        PRIM03Incertitude.push([iterator[0], iterator[2]]);
      }
      // setDataIncertitude([SEC02CIncertitude, PRIM03Incertitude]);
      // console.log(SEC02C)
      const SEC02Cinfo = {numFR: SEC02C.numFR, date: SEC02C.date};
      const PRIM03info = {numFR: PRIM03.numFR, date: PRIM03.date};
      const dataIncertitude = [SEC02CIncertitude, PRIM03Incertitude];
      const data = [SEC02CLog, PRIM03Log];
      const info = [SEC02Cinfo, PRIM03info];
      storeData('dataLog', JSON.stringify({data, dataIncertitude, info}));
      // const result = regression.polynomial(SEC02CLog, {
      //   order: 4,
      //   precision: 12,
      // });
      // const resultIncertitude = regression.polynomial(
      //   dataIncertitude[selectedIndexCapteur],
      //   {
      //     order: 4,
      //     precision: 12,
      //   },
      // );
      // setVide(result.predict(value)[1]);
      // setIncertitude(resultIncertitude.predict(value)[1]);
    }
  }, [SEC02C, PRIM03]);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  let ptEtalonnageSEC02CArray = [];
  let ptEtalonnagePRIM03Array = [];

  const fetchData = () => {
    axios
      .get('https://lomano.fr/getEtalon')
      .then(rep => {
        let reponse = rep.data.msg;
        let videData = reponse.filter(e => e.domaine == 'VIDE');
        let SEC02C_data = videData.filter(e => e.marquage == 'SEC02C');
        let PRIM03_data = videData.filter(e => e.marquage == 'PRIM03');

        let lastEtalonnageSEC02C = SEC02C_data.sort((a, b) => b.id - a.id)[0];
        let lastEtalonnagePRIM03 = PRIM03_data.sort((a, b) => b.id - a.id)[0];
        const ptsEtalonnageSEC02CObjet = JSON.parse(
          lastEtalonnageSEC02C.ptsEtalonnage,
        );
        const ptsEtalonnagePRIM03Objet = JSON.parse(
          lastEtalonnagePRIM03.ptsEtalonnage,
        );
        for (let i = 0; i < ptsEtalonnageSEC02CObjet.reference.length; i++) {
          let temp = [
            ptsEtalonnageSEC02CObjet.appareil[i],
            ptsEtalonnageSEC02CObjet.reference[i],
            ptsEtalonnageSEC02CObjet.incertitude[i],
          ];
          ptEtalonnageSEC02CArray.push(temp);
        }
        for (let i = 0; i < ptsEtalonnagePRIM03Objet.reference.length; i++) {
          let temp = [
            ptsEtalonnagePRIM03Objet.appareil[i],
            ptsEtalonnagePRIM03Objet.reference[i],
            ptsEtalonnagePRIM03Objet.incertitude[i],
          ];
          ptEtalonnagePRIM03Array.push(temp);
        }
        const degreModelisationSEC02C = JSON.parse(
          lastEtalonnageSEC02C.modelisation,
        ).equation.length;
        const degreModelisationPRIM03 = JSON.parse(
          lastEtalonnagePRIM03.modelisation,
        ).equation.length;
        let donnéesSEC02C = {
          data: ptEtalonnageSEC02CArray,
          numFR: lastEtalonnageSEC02C.numCertificat,
          date: lastEtalonnageSEC02C.dateEtalonnage,
        };
        let donnéesPRIM03 = {
          data: ptEtalonnagePRIM03Array,
          numFR: lastEtalonnagePRIM03.numCertificat,
          date: lastEtalonnagePRIM03.dateEtalonnage,
        };

        // storeData('SEC02C', JSON.stringify(donnéesSEC02C));
        // storeData('PRIM03', JSON.stringify(donnéesPRIM03));
        setSEC02C(donnéesSEC02C);
        setPRIM03(donnéesPRIM03);
      })
      .catch(err => console.log('err', err));
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
      console.log(jsonValue);
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
    // setValue
    console.log(input);
    console.log(typeof input);
    setValue(input);
    setValueString(input.toString());
  };
  const raz = () => {
    setValueString('');
    setValue(0);
  };
  if (modelisation) {
    return (
      <>
        <View style={{flex: 1}}>
          <Divider style={{backgroundColor: 'blue'}} />
          <ButtonGroup
            onPress={updateIndexCapteur}
            selectedIndex={selectedIndexCapteur}
            buttons={capteurs}
            containerStyle={{height: 50, marginVertical: 20}}
          />
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
                    // resource="http://www.pdf995.com/samples/pdf.pdf"
                    resource={`https://lomano.go.yo.fr/rapport_trescal/${capteurs[selectedIndexCapteur]}.pdf`}
                    resourceType="url"
                  />
                </Overlay>
              </View>

              <View
                style={{
                  flex: 10,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  // backgroundColor:"grey"
                }}>
                <Pressable
                  style={{flexDirection: 'row'}}
                  onPress={toggleOverlay}>
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
                    {`${dataComplete.info[selectedIndexCapteur].numFR} du ${dataComplete.info[selectedIndexCapteur].date}`}
                  </Text>
                </Pressable>
                <Divider
                  style={{
                    backgroundColor: 'blue',
                    marginVertical: 10,
                    width: 100,
                  }}
                />

                <Text
                  //  h2
                  style={{
                    fontSize: 50,
                    alignSelf: 'auto',
                  }}>
                  {`${Math.pow(10, vide).toExponential(2)} mbar`}
                </Text>

                <Tooltip
                  height={200}
                  backgroundColor={'lightblue'}
                  overlayColor="rgba(250, 250, 250, 0.90)"
                  popover={
                    <View>
                      <Text>
                        L'incertitude est calculé en fonction de ca et de ca
                      </Text>
                      <Text>
                        L'incertitude est calculé en fonction de ca et de ca
                      </Text>
                      <Text>
                        L'incertitude est calculé en fonction de ca et de ca
                      </Text>
                      <Text>
                        L'incertitude est calculé en fonction de ca et de ca
                      </Text>
                    </View>
                  }>
                  <Text
                    style={{
                      fontSize: 40,
                      alignSelf: 'auto',
                    }}>
                    {/* {`Ie = ${Number.parseFloat(incertitude).toFixed(1)} %`} */}
                  </Text>
                </Tooltip>
                <Divider
                  style={{
                    backgroundColor: 'blue',
                    marginVertical: 10,
                    width: 100,
                  }}
                />
                <Button title="fetch" onPress={fetchData} />
                <Button title="read" onPress={() => getData('SEC02C')} />
                <Text
                  style={{
                    fontSize: 40,
                  }}>
                  {`Brute : ${Number.parseFloat(value).toExponential(2)} mbar`}
                  {/* {`Tension : ${Math.round(value * 1000) / 1000} V`} */}
                </Text>
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
                    errorStyle={{color: 'red'}}
                    errorMessage={
                      value != 0 &&
                      value >
                        // dataCapteurs[selectedIndexCapteur][dataCapteurs[selectedIndexCapteur].length - 1][0] ||
                        // value < dataCapteurs[selectedIndexCapteur][0][0])
                        0
                        ? "VALEUR EN DEHORS DE LA PLAGE D'ETALONNAGE"
                        : null
                    }
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
                <Divider
                  style={{backgroundColor: 'blue', marginVertical: 10}}
                />
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
                min={1e-4}
                max={1}
                // min={etalonChoisi.data[0][0]}
                // max={etalonChoisi.data[etalonChoisi.data.length - 1][0]}
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
        <Button title="read" onPress={() => getData('SEC02C')} />
      </View>
    );
};
