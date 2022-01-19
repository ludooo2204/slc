import axios from 'axios';

export const transformerVideToLog = etalon => {
  let etalonLog = [...etalon.data];
  let tempEtalonLog = [];
  let tempEtalonLog2 = [];
  for (const iterator of etalonLog) {
    let temp = Math.log10(iterator[1]);
    let temp2 = Math.log10(iterator[0]);
    tempEtalonLog.push(temp);
    tempEtalonLog2.push(temp2);
  }
  for (let i = 0; i < tempEtalonLog.length; i++) {
    etalonLog[i][1] = tempEtalonLog[i];
    etalonLog[i][0] = tempEtalonLog2[i];
  }
  return etalonLog;
};

export const fetchDataEtalon = () => {
  let ptEtalonnageSEC02CArray = [];
  let ptEtalonnagePRIM03Array = [];
  let dataTEmp;
  return axios
    .get('https://lomano.fr/getEtalon')
    .then(rep => {
      let reponse = rep.data.msg;
      let videData = reponse.filter(e => e.domaine == 'VIDE');
      let SEC02C_data = videData.filter(e => e.marquage == 'SEC02C');
      let PRIM03_data = videData.filter(e => e.marquage == 'PRIM03');

      let lastEtalonnageSEC02C = SEC02C_data.sort((a, b) => b.id - a.id)[0];
      let lastEtalonnagePRIM03 = PRIM03_data.sort((a, b) => b.id - a.id)[0];
      const ptsEtalonnageSEC02CObjet = JSON.parse(lastEtalonnageSEC02C.ptsEtalonnage);
      const ptsEtalonnagePRIM03Objet = JSON.parse(lastEtalonnagePRIM03.ptsEtalonnage);
      for (let i = 0; i < ptsEtalonnageSEC02CObjet.reference.length; i++) {
        let temp = [ptsEtalonnageSEC02CObjet.appareil[i], ptsEtalonnageSEC02CObjet.reference[i], ptsEtalonnageSEC02CObjet.incertitude[i]];
        ptEtalonnageSEC02CArray.push(temp);
      }
      for (let i = 0; i < ptsEtalonnagePRIM03Objet.reference.length; i++) {
        let temp = [ptsEtalonnagePRIM03Objet.appareil[i], ptsEtalonnagePRIM03Objet.reference[i], ptsEtalonnagePRIM03Objet.incertitude[i]];
        ptEtalonnagePRIM03Array.push(temp);
      }
      const degreModelisationSEC02C = JSON.parse(lastEtalonnageSEC02C.modelisation).equation.length;
      const degreModelisationPRIM03 = JSON.parse(lastEtalonnagePRIM03.modelisation).equation.length;
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
      return [donnéesSEC02C, donnéesPRIM03];
    })
    .catch(err => console.log('err', err));
};
