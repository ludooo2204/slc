import React, {useState,useEffect} from 'react';
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export const Vide = () => {
  //   const [checked, toggleChecked] = useState(true);
  //   const [placeholder, setPlaceholder] = useState('Saisir tension');
  const [value, setValue] = useState(5);
  const [valueString, setValueString] = useState('');
  const [open, setOpen] = useState(false);
  //   const [debit, setDebit] = useState(0);
  //   const [comment, setComment] = useState('');
  const [selectedIndexCapteur, setIndexCapteur] = useState(1);
  //   const [selectedIndexGaz, setIndexGaz] = useState(1);
  //   const [selectedIndexType, setIndexType] = useState(0);
useEffect(() => {
  console.log("axios gogogo")
  // console.log(axios);
  axios.get("https://lomano.fr/getEtalon")
  .then(rep=>{    console.log("axios etalon")
    // console.log(rep.data.msg)
    let reponse= rep.data.msg
   let videData=reponse.filter(e=>e.domaine=="VIDE")
   console.log(videData)
   let SEC02C_data=videData.filter(e=>e.marquage=="SEC02C")
   let PRIM03_data=videData.filter(e=>e.marquage=="PRIM03")
  //  let PRIM02_data=videData.filter(e=>e.marquage=="PRIM02")

  let lastEtalonnageSEC02C =SEC02C_data.sort((a,b)=>b.id-a.id)[0]
  let lastEtalonnagePRIM03 =PRIM03_data.sort((a,b)=>b.id-a.id)[0]
  // let lastEtalonnagePRIM02 =PRIM02_data.sort((a,b)=>b.id-a.id)[0]
  console.log(lastEtalonnagePRIM03)
  console.log(lastEtalonnageSEC02C)
  })
  .catch(err=>console.log("err",err))
}, [])


  let PIRANI = [
    [2.148, 1.3e-3, 24.5],
    [2.643, 4.79e-3, 11.6],
    [3.009, 1e-2, 10.2],
    [3.963, 5.02e-2, 8.2],
    [4.564, 9.98e-2, 7.2],
    [5.751, 4.93e-1, 5.9],
    [6.393, 9.87e-1, 5.9],
  ];
  let WRG = [
    [4.469, 7.84e-6, 21.6],
    [4.891, 2.96e-5, 19],
    [5.056, 6.46e-5, 18],
    [5.113, 9.8e-5, 17.7],
    [5.458, 3.17e-4, 16.6],
    [5.705, 8.05e-4, 16.1],
    [5.73, 9.85e-4, 16.1],
  ];

  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  let PiraniLog = [...PIRANI];
  PIRANI.date = '08/11/2021';
  PIRANI.NumRapport = 'FR214513507';
  WRG.date = '08/11/2021';
  WRG.NumRapport = 'FR214513505';
  for (const iterator of PiraniLog) {
    iterator[1] = Math.log10(iterator[1]);
  }
  let WrgLog = [...WRG];
  for (const iterator of WrgLog) {
    iterator[1] = Math.log10(iterator[1]);
  }
  const capteurs = ['Pirani 150091814', 'WRG 170367804'];
  const dataCapteurs = [PiraniLog, WrgLog];
  let PiraniIncertitude = [];
  for (const iterator of PIRANI) {
    PiraniIncertitude.push([iterator[0], iterator[2]]);
  }
  let WrgIncertitude = [];
  for (const iterator of WRG) {
    WrgIncertitude.push([iterator[0], iterator[2]]);
  }
  const dataIncertitude = [PiraniIncertitude, WrgIncertitude];
  const dataEtalonnage = [
    [PIRANI.NumRapport, PIRANI.date],
    [WRG.NumRapport, WRG.date],
  ];

  const result = regression.polynomial(dataCapteurs[selectedIndexCapteur], {
    order: 4,
    precision: 12,
  });
  const resultIncertitude = regression.polynomial(
    dataIncertitude[selectedIndexCapteur],
    {
      order: 4,
      precision: 12,
    },
  );

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

  const debit = result.predict(value)[1];
  const debitIncertitude = resultIncertitude.predict(value)[1];

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
<<<<<<< HEAD
              {/* {console.log(`https://lomano.go.yo.fr/${capteurs[selectedIndexCapteur]}.pdf`)} */}

=======
      
>>>>>>> b091446b938c98a40302e1de1d21ef89007da747
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
                //  h2
                style={{
                  fontSize: 50,
                  alignSelf: 'auto',
                }}>{`${Math.pow(10, debit).toExponential(2)} mbar`}</Text>

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
                  }}>{`Ie = ${Number.parseFloat(debitIncertitude).toFixed(
                  1,
                )} %`}</Text>
              </Tooltip>
              <Divider
                style={{
                  backgroundColor: 'blue',
                  marginVertical: 10,
                  width: 100,
                }}
              />
              <Text
                style={{
                  fontSize: 40,
                }}>
                {`Tension : ${Number.parseFloat(value).toFixed(3)} V`}
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
                    (value >
                      dataCapteurs[selectedIndexCapteur][
                        dataCapteurs[selectedIndexCapteur].length - 1
                      ][0] ||
                      value < dataCapteurs[selectedIndexCapteur][0][0])
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
              <Divider style={{backgroundColor: 'blue', marginVertical: 10}} />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              //   marginHorizontal: ,
              paddingRight: 10,
              //   marginVertical: 20,
              //   marginTop: 10,
            }}>
            <VerticalSlider
              value={value}
              disabled={false}
              min={dataCapteurs[selectedIndexCapteur][0][0]}
              max={
                dataCapteurs[selectedIndexCapteur][
                  dataCapteurs[selectedIndexCapteur].length - 1
                ][0]
              }
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
};
